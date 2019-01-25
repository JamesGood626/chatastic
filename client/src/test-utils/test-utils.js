import * as React from "react";
import ApolloClient from "apollo-client";
import { DefaultOptions } from "apollo-client/ApolloClient";
import { InMemoryCache as Cache } from "apollo-cache-inmemory";

import { ApolloProvider } from "react-apollo";
import { MockedResponse, MockLink } from "./test-links";
import { ApolloCache } from "apollo-cache";
export * from "./test-links";

export class MockedProvider extends React.Component {
  constructor(props) {
    super(props);
    console.log("IT WORKS!!!!!!");
    const { mocks, addTypename, defaultOptions, cache } = this.props;
    const client = new ApolloClient({
      cache: cache || new Cache({ addTypename }),
      defaultOptions,
      link: new MockLink(mocks || [], addTypename)
    });

    this.state = { client };
  }

  render() {
    return (
      <ApolloProvider client={this.state.client}>
        {this.props.children}
      </ApolloProvider>
    );
  }

  componentWillUnmount() {
    if (!this.state.client.queryManager) {
      return;
    }
    const scheduler = this.state.client.queryManager.scheduler;
    Object.keys(scheduler.registeredQueries).forEach(queryId => {
      scheduler.stopPollingQuery(queryId);
    });
    Object.keys(scheduler.intervalQueries).forEach(interval => {
      scheduler.fetchQueriesOnInterval(interval);
    });
  }
}
