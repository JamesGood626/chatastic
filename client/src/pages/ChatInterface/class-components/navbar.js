import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "@reach/router";
// import { client } from "../../../App";
import {
  ApolloConsumer,
  Query,
  Mutation,
  graphql,
  compose
} from "react-apollo";
import { gql } from "apollo-boost";
import { LOGIN_USER } from "../../../graphQL/mutations/remote/accounts";
import { getAuthenticatedUser } from "../../../graphQL/queries/local/accounts";
import { getGroups } from "../../../graphQL/queries/local/groups";
import { getGroupActivities } from "../../../graphQL/queries/local/groupActivities";
import { getGroupInvitations } from "../../../graphQL/queries/local/groupInvitations";

import AdditionalOptions from "./additionalOptions";
import MessageList from "./messageList";

// TESTING USING THIS FRAG FOR RETRIEVING GROUP ACTIVITY VIA THE
// dataIdFromObject that is returned when initially querying for them from the server.
const frag = gql`
  fragment GroupActivityDetails on groupActivities {
    uuid
    groupUuid
    directChats {
      channel
      senderUsername
      recipientUsername
      messages {
        text
        sendDate
        sender {
          username
        }
      }
    }
  }
`;

// client.readFragment({
//   id,
//   fragment: frag
// });

const renderList = (data, key) => {
  console.log("WHAT IS RENDER LIST BEING CALLED WITH? ", data);
  return data.map((item, i) => (
    <li key={`title-${item[key]}-${i}`}>{item[key]}</li>
  ));
};

const listGroupChats = groupChats =>
  groupChats.map(chat => (
    <li key={chat.channel} id={chat.channel}>
      {chat.title}
    </li>
  ));

const normalizeData = (data, key) => {
  if (data.length === 0) {
    return null;
  }
  return data.reduce((acc, curr) => {
    acc = {
      ...acc,
      [curr[key]]: curr
    };
    return acc;
  }, {});
};

const renderIfGroupActivityHasChat = (groupActivity, uuid, username) => {
  const ga = groupActivity[uuid];
  if (ga.hasOwnProperty("directChats") && ga.directChats[0] !== null) {
    return ga.directChats.map(chat => (
      <li key={chat.channel} id={chat.channel}>
        {username === chat.senderUsername
          ? chat.recipientUsername
          : chat.senderUsername}
      </li>
    ));
  }
  return null;
};

const groupHasChats = group => {
  if (group.hasOwnProperty("chats") && group.chats[0] !== null) {
    return true;
  }
  return false;
};

// Todo:
// four buttons for ->
// create group
// invite to group
// create chat
// pending invitations

const NavAside = styled.aside`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1.4rem;
  min-width: 30rem;
  height: 100vh;
  background: #fcfcfc;
`;

const ChatNavOptions = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  background: yellow;
`;

const ChatNavBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-left: 2.4rem;
  min-height: 24rem;
  height: 24rem;
  width: 100%;
  background: blue;

  h3 {
    margin-bottom: -1rem;
  }
`;

const ChatNavBlockList = styled.ul`
  overflow-y: scroll;
  height: 18rem;
  background: #d40;
`;

// Will need to use this... or somehting similar in another place.
// return (
//   <ApolloConsumer>
//     {client => {
//       if (activeGroup) {
//         client.writeData({ data: { activeGroup } });
//       }
//     }}
//     </ApolloConsumer>
//   );

// TODO:
// 1. Get groupInvitations working
// 2. Test
// 3. Refactor
class Navbar extends Component {
  componentDidMount = () => {
    console.log("Navbar props: ", this.props);
  };

  // TODO (refactor):
  // Move ApolloConsumer up One level and pass down client as props
  // to each of the nested components in the main index.js of this folder.
  render() {
    const firstname = "userFirstName";
    const lastname = "userLastName";
    return (
      <NavAside>
        <Query query={getAuthenticatedUser}>
          {({ data, loading, error }) => {
            console.log("WHY YOU ERROR USER? ", error);
            console.log("GET AUTH USER DATA: ", data);
            if (loading) return <h1>Loading...</h1>;
            if (error) return <h1>ERR</h1>;
            const { firstname, lastname } = data.getAuthenticatedUser;
            return <h3>Welcome, {`${firstname} ${lastname}`}</h3>;
          }}
        </Query>
        <AdditionalOptions />
        <ChatNavOptions>
          <ChatNavBlock>
            <h3>Groups</h3>
            <ChatNavBlockList>
              <Query query={getGroups}>
                {({ data, loading, error }) => {
                  console.log("GET GROUPS ERR: ", error);
                  console.log("GET GROUPS DATA: ", data);
                  if (loading) return <h1>Loading...</h1>;
                  if (error) return <h1>ERR</h1>;
                  return renderList(data.groups, "title");
                }}
              </Query>
            </ChatNavBlockList>
          </ChatNavBlock>
          <ChatNavBlock>
            <h3>Group Chats</h3>
            <ChatNavBlockList>
              <h1>Group Chats go here</h1>
            </ChatNavBlockList>
          </ChatNavBlock>
          <ChatNavBlock>
            <h3>Group Members</h3>
            <ChatNavBlockList>
              <h1>Group Members go here</h1>
            </ChatNavBlockList>
          </ChatNavBlock>
          <ChatNavBlock>
            <h3>Direct Chats</h3>
            <ChatNavBlockList>
              <h1>Direct Chatsgo here</h1>
            </ChatNavBlockList>
          </ChatNavBlock>
        </ChatNavOptions>
      </NavAside>
    );
  }
}

export default Navbar;

// export default compose(
//   graphql(getAuthenticatedUser, {
//     props: ({ data: { authenticatedUser } }) => ({
//       authenticatedUser
//     })
//   })
// )(Navbar);

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
