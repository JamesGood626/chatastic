import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "@reach/router";
// import { client } from "../../../App";
import { Query, Mutation, graphql, compose } from "react-apollo";
import { gql } from "apollo-boost";
import { ALL_USERS } from "../../../graphQL/queries/remote/accounts";
import { getAuthenticatedUser } from "../../../graphQL/queries/local/accounts";

import AdditionalOptions from "./additionalOptions";
import MessageList from "./messageList";

const NavAside = styled.aside`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 4rem;
  width: 18rem;
  height: 100vh;
  background: lime;
`;

const ChatNavOptions = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ChatNavBlock = styled.div`
  width: 100%;
  height: 100%;
  background: blue;
`;

const ChatNavBlockList = styled.ul`
  background: #d40;
`;

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

class Navbar extends Component {
  componentDidMount = () => {
    console.log("PROPS FOR NAVBAR: ", this.props);
    // const authenticatedUser = client.readQuery(getAuthenticatedUser);
    // console.log(authenticatedUser);
  };

  render() {
    const { firstname, lastname } = this.props.authenticatedUser;
    return (
      <NavAside>
        <h3>Welcome, {`${firstname} ${lastname}`}</h3>
        <AdditionalOptions />
        <ChatNavOptions>
          <ChatNavBlock>
            <h3>Groups</h3>
            <ChatNavBlockList>
              <li>groups item one</li>
            </ChatNavBlockList>
          </ChatNavBlock>
          <ChatNavBlock>
            <h3>Group Chats</h3>
            <ChatNavBlockList>
              <li>group chats item one</li>
            </ChatNavBlockList>
          </ChatNavBlock>
          <ChatNavBlock>
            <h3>Group Members</h3>
            <ChatNavBlockList>
              <li>group members item one</li>
            </ChatNavBlockList>
          </ChatNavBlock>
        </ChatNavOptions>
      </NavAside>
    );
  }
}

// export default Navbar;

export default compose(
  graphql(getAuthenticatedUser, {
    props: ({ data: { authenticatedUser } }) => ({
      authenticatedUser
    })
  })
)(Navbar);

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

// const Users = () => (
//   <Query query={ALL_USERS}>
//     {({ loading, error, data, subscribeToMore }) => {
//       if (loading) return "Loading...";
//       if (error) return `Error! ${error.message}`;

//       return (
//         <MessageList users={data.allUsers} subscribeToMore={subscribeToMore} />
//       );
//     }}
//   </Query>
// );

// const MakeAUser = () => {
//   return (
//     <Mutation mutation={CREATE_USER}>
//       {(CREATE_USER, { data }) => (
//         <button
//           onClick={e => {
//             e.preventDefault();
//             console.log("CREATING USER BUTTON ONCLICK");
//             CREATE_USER({
//               variables: {
//                 userInput: {
//                   id: 3,
//                   firstname: "John",
//                   lastname: "Jingleheimer",
//                   username: "Schmidt",
//                   password: "password",
//                   channelId: 1
//                 }
//               }
//             });
//           }}
//         >
//           Add User
//         </button>
//       )}
//     </Mutation>
//   );
// };
