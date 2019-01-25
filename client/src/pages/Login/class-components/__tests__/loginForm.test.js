import React from "react";
import { ApolloProvider } from "react-apollo";
import { MockedProvider } from "react-apollo/test-utils";
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from "react-testing-library";
// this adds custom jest matchers from jest-dom
import "jest-dom/extend-expect";
import { LOGIN_USER } from "../../../../graphQL/mutations/remote/accounts";
import Login from "../../index";
import LoginForm from "../LoginForm";
import client from "../../../../graphQL/schema/mockClient";

afterEach(cleanup);

// const mocks = [
//   {
//     request: {
//       query: LOGIN_USER,
//       variables: {
//         username: "Jimmy",
//         firstname: "Jim",
//         lastname: "Flannel",
//         password: "password"
//       }
//     },
//     result: {
//       data: {
//         loginUser: {
//           uuid: "1234",
//           username: "Jimmy",
//           firstname: "Jim",
//           lastname: "Flannel"
//         }
//       }
//     }
//   }
// ];

// Link below will be good for when I want to get into testing the
// Redirect behavior.
// https://spectrum.chat/react-testing-library/general/testing-reach-router~d5a5feae-3193-492e-9405-d1e2204aa0cc
// NOTE: Will need to actually test this later. i.e. obtain the inputs via testId
//        and enter in the username and password. Right now I just have these set on state
//        for ease of development.
it("renders without error", () => {
  const { debug, getByTestId } = render(
    <ApolloProvider client={client}>
      {/* <LoginForm path="/login" /> */}
      <Login />
    </ApolloProvider>
  );
  const submitBtn = getByTestId("login-submit-btn");
  // fireEvent.click(submitBtn);
  // debug();
});
