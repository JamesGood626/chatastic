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
import { CREATE_GROUP } from "../../../../graphQL/mutations/remote/groups";
import CreateGroupBtn from "../createGroupBtn";
import client from "../../../../graphQL/schema/mockSchema";

afterEach(cleanup);

// createGroup and updateGroups are passed down as props to the CreateGroupBtn
// from the CreateGroupController -> Will actually test the updating of an existing groups
// array in cache in the CreateGroupController's tests
const createGroup = CREATE_GROUP => {
  CREATE_GROUP({
    variables: {
      input: { title: "Red Team" }
    }
  });
};

// It is kind of odd to have to test in this function... but there's really no other good option.
const updateGroups = (cache, { data: { createGroup } }) => {
  console.log("GOT THE createGroup data in update: ", createGroup);
  expect(createGroup.creator.username).toBe("Jim");
  // The cache is available at this point....
  // console.log("IS THERE CACHE??? ", cache);
};

// const mocks = [
//   {
//     request: {
//       query: CREATE_GROUP,
//       variables: {
//         title: "Red Team"
//       }
//     },
//     result: {
//       data: {
//         createGroup: {
//           uuid: "1234",
//           title: "Red Team"
//         }
//       }
//     }
//   }
// ];

it("renders without error", () => {
  const { debug, getByTestId } = render(
    <ApolloProvider client={client}>
      <CreateGroupBtn createGroup={createGroup} updateGroups={updateGroups} />
    </ApolloProvider>
  );
  const submitBtn = getByTestId("create-group-submit-btn");
  fireEvent.click(submitBtn);
  // debug();
});

it("it adds", () => {
  expect(1 + 1).toBe(2);
});
