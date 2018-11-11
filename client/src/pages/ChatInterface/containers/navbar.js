import React, { Component } from "react";
import { Link } from "@reach/router";
import { Query, Mutation, Subscription } from "react-apollo";
import { gql } from "apollo-boost";
import { ALL_USERS } from "../../../graphQL/queries/remote/accounts";

import MessageList from "./messageList";

const userInput = gql`
  input UserInput {
    id: Int!
    firstname: String!
    lastname: String!
    username: String!
    password: String!
    channelId: Int!
  }
`;

const CREATE_USER = gql`
  mutation createUser($userInput: UserInput!) {
    createUser(input: $userInput) {
      firstname
    }
  }
`;

// const HeresAUser = ({ channelId }) => (
//   <Subscription
//     subscription={USER_CREATED}
//     variables={{ channelId }} // this will be the specific group id which I'll need to pass in
//     // to utilize on the server??
//   >
//     {({ data: { userCreated }, loading }) => (
//       <h4>New user: {!loading && userCreated.username}</h4>
//     )}
//   </Subscription>
// );

const Users = () => (
  <Query query={ALL_USERS}>
    {({ loading, error, data, subscribeToMore }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;

      return (
        <MessageList users={data.allUsers} subscribeToMore={subscribeToMore} />
      );
    }}
  </Query>
);

const MakeAUser = () => {
  return (
    <Mutation mutation={CREATE_USER}>
      {(CREATE_USER, { data }) => (
        <button
          onClick={e => {
            e.preventDefault();
            console.log("CREATING USER BUTTON ONCLICK");
            CREATE_USER({
              variables: {
                userInput: {
                  id: 3,
                  firstname: "John",
                  lastname: "Jingleheimer",
                  username: "Schmidt",
                  password: "password",
                  channelId: 1
                }
              }
            });
          }}
        >
          Add User
        </button>
      )}
    </Mutation>
  );
};

export default class Navbar extends Component {
  render() {
    return (
      <aside>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/account">Account</Link>
          </li>
        </ul>
        <Users />
        <MakeAUser />
      </aside>
    );
  }
}
