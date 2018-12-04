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

const renderList = (data, key) => data.map(item => <li>{item[key]}</li>);

const listGroupChats = groupChats =>
  groupChats.map(chat => <li id={chat.channel}>{chat.title}</li>);

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
      <li>
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
  background: yellow;
`;

const ChatNavBlock = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-left: 2.4rem;
  min-height: 13.8rem;
  height: 100%;
  width: 100%;
  background: blue;
`;

const ChatNavBlockList = styled.ul`
  background: #d40;
`;

// TODO:
// 1. Get groupInvitations working
// 2. Test
// 3. Refactor
class Navbar extends Component {
  state = {
    activeGroup: null,
    normalizedGroups: null,
    normalizedGroupActivities: null
  };

  componentDidMount = () => {
    const { groups, groupActivities } = this.props;
    if (groups.length > 0) {
      const normalizedGroups = normalizeData(groups, "uuid");
      const normalizedGroupActivities = normalizeData(
        groupActivities,
        "groupUuid"
      );
      this.setLoadedState(
        groups[0],
        normalizedGroups,
        normalizedGroupActivities
      );
    }
    console.log("Navbar props: ", this.props);
    const { token } = this.props.authenticatedUser;
    if (token) {
      localStorage.setItem("token", token);
    }
  };

  setLoadedState = (group, normalizedGroups, normalizedGroupActivities) => {
    this.setState({
      activeGroup: group,
      normalizedGroups,
      normalizedGroupActivities
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    console.log("LOADED STATE SET: ", this.state);
  };

  // TODO (refactor):
  // Move ApolloConsumer up One level and pass down client as props
  // to each of the nested components in the main index.js of this folder.
  render() {
    const { firstname, lastname, username } = this.props.authenticatedUser;
    const { groups } = this.props;
    const {
      activeGroup,
      normalizedGroupActivities: groupActivities
    } = this.state;
    return (
      <ApolloConsumer>
        {client => {
          if (activeGroup) {
            client.writeData({ data: { activeGroup } });
          }
          return (
            <NavAside>
              <h3>Welcome, {`${firstname} ${lastname}`}</h3>
              <AdditionalOptions />
              <ChatNavOptions>
                <ChatNavBlock>
                  <h3>Groups</h3>
                  <ChatNavBlockList>
                    {groups.length !== 0 && renderList(groups, "title")}
                  </ChatNavBlockList>
                </ChatNavBlock>
                <ChatNavBlock>
                  <h3>Group Chats</h3>
                  <ChatNavBlockList>
                    {activeGroup
                      ? groupHasChats(activeGroup) &&
                        listGroupChats(activeGroup.chats)
                      : null}
                  </ChatNavBlockList>
                </ChatNavBlock>
                <ChatNavBlock>
                  <h3>Group Members</h3>
                  <ChatNavBlockList>
                    {activeGroup && renderList(activeGroup.members, "username")}
                  </ChatNavBlockList>
                </ChatNavBlock>
                <ChatNavBlock>
                  <h3>Direct Chats</h3>
                  <ChatNavBlockList>
                    {groupActivities &&
                      renderIfGroupActivityHasChat(
                        groupActivities,
                        activeGroup.uuid,
                        username
                      )}
                  </ChatNavBlockList>
                </ChatNavBlock>
              </ChatNavOptions>
            </NavAside>
          );
        }}
      </ApolloConsumer>
    );
  }
}

export default compose(
  graphql(getAuthenticatedUser, {
    props: ({ data: { authenticatedUser } }) => ({
      authenticatedUser
    })
  }),
  graphql(getGroups, {
    props: ({ data: { groups } }) => ({
      groups
    })
  }),
  graphql(getGroupActivities, {
    props: ({ data: { groupActivities } }) => ({
      groupActivities
    })
  }),
  graphql(getGroupInvitations, {
    props: ({ data: { groupInvitations } }) => ({
      groupInvitations
    })
  })
)(Navbar);

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
