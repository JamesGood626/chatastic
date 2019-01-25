// And remember to uninstall apollo-link as well
import {
  Operation,
  GraphQLRequest,
  ApolloLink,
  FetchResult,
  Observable
  // Observer,
} from "apollo-link";

import { print } from "graphql/language/printer";
// Remember to uninstall apollo-utilities
import { addTypenameToDocument } from "apollo-utilities";
const isEqual = require("lodash.isequal");

export class MockLink extends ApolloLink {
  constructor(mockedResponses, addTypename = true) {
    super();
    this.addTypename = addTypename;
    if (mockedResponses)
      mockedResponses.forEach(mockedResponse => {
        this.addMockedResponse(mockedResponse);
      });
  }

  addMockedResponse(mockedResponse) {
    const key = requestToKey(mockedResponse.request, this.addTypename);
    let mockedResponses = this.mockedResponsesByKey[key];
    if (!mockedResponses) {
      mockedResponses = [];
      this.mockedResponsesByKey[key] = mockedResponses;
    }
    mockedResponses.push(mockedResponse);
  }

  request(operation) {
    const key = requestToKey(operation, this.addTypename);
    let responseIndex;
    const response = (this.mockedResponsesByKey[key] || []).find(
      (res, index) => {
        const requestVariables = operation.variables || {};
        const mockedResponseVariables = res.request.variables || {};
        if (!isEqual(requestVariables, mockedResponseVariables)) {
          return false;
        }
        responseIndex = index;
        return true;
      }
    );

    if (!response || typeof responseIndex === "undefined") {
      throw new Error(
        `No more mocked responses for the query: ${print(
          operation.query
        )}, variables: ${JSON.stringify(operation.variables)}`
      );
    }

    this.mockedResponsesByKey[key].splice(responseIndex, 1);

    const { result, error, delay, newData } = response;

    if (newData) {
      response.result = newData();
      this.mockedResponsesByKey[key].push(response);
    }

    if (!result && !error) {
      throw new Error(
        `Mocked response should contain either result or error: ${key}`
      );
    }

    return new Observable(observer => {
      let timer = setTimeout(
        () => {
          if (error) {
            observer.error(error);
          } else {
            if (result) observer.next(result);
            observer.complete();
          }
        },
        delay ? delay : 0
      );

      return () => {
        clearTimeout(timer);
      };
    });
  }
}

export class MockSubscriptionLink extends ApolloLink {
  constructor() {
    super();
  }

  request(_req) {
    return new Observable(observer => {
      this.setups.forEach(x => x());
      this.observer = observer;
      return () => {
        this.unsubscribers.forEach(x => x());
      };
    });
  }

  simulateResult(result) {
    setTimeout(() => {
      const { observer } = this;
      if (!observer) throw new Error("subscription torn down");
      if (result.result && observer.next) observer.next(result.result);
      if (result.error && observer.error) observer.error(result.error);
    }, result.delay || 0);
  }

  onSetup(listener) {
    this.setups = this.setups.concat([listener]);
  }

  onUnsubscribe(listener) {
    this.unsubscribers = this.unsubscribers.concat([listener]);
  }
}

function requestToKey(request, addTypename) {
  const queryString =
    request.query &&
    print(addTypename ? addTypenameToDocument(request.query) : request.query);

  const requestKey = { query: queryString };

  return JSON.stringify(requestKey);
}

// Pass in multiple mocked responses, so that you can test flows that end up
// making multiple queries to the server
// NOTE: The last arg can optionally be an `addTypename` arg
export function mockSingleLink(...mockedResponses) {
  // to pull off the potential typename. If this isn't a boolean, we'll just set it true later
  let maybeTypename = mockedResponses[mockedResponses.length - 1];
  let mocks = mockedResponses.slice(0, mockedResponses.length - 1);

  if (typeof maybeTypename !== "boolean") {
    mocks = mockedResponses;
    maybeTypename = true;
  }

  return new MockLink(mocks, maybeTypename);
}

export function mockObservableLink() {
  return new MockSubscriptionLink();
}
