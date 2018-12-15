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
import client from "../../../../graphQL/schema/mockSchema";

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

// it("renders without error", () => {
//   const { debug, getByTestId } = render(
//     <MockedProvider mocks={mocks} addTypename={false}>
//       <LoginForm />
//     </MockedProvider>
//   );
//   const submitBtn = getByTestId("login-submit-btn");
//   // fireEvent.click(submitBtn);
//   // debug();
// });

// Mocked provider github repo link:
// https://github.com/apollographql/react-apollo/blob/master/src/test-utils.tsx

// Not the error message for this test -- but I get something along the lines
// of this.
// UnhandledPromiseRejectionWarning: Error: No more mocked responses for the query: mutation createGroupOp($input: CreateGroupInput!) {
//   createGroup(input: $input) {
//     uuid
//     title
//     members {      username
//     }
//     creator {
//       username
//     }
//     chats {
//       channel
//       title
//     }

// In this repo file for apollo client (MockedLink) <- used by MockedProvider:
// https://github.com/apollographql/react-apollo/blob/master/src/test-links.ts

// Line 69 is responsible for the error I'm seeing.
// When I get more screen real estate, copy paste in the source code and import
// it into this file, that way I can do a ish ton of console logging to debug this...
// or use the debugger
