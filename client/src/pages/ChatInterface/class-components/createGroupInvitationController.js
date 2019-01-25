import React, { PureComponent } from "react";
import styled, { keyframes } from "styled-components";
import { ApolloConsumer, graphql, compose } from "react-apollo";
import CreateGroupInvitationBtn from "../fun-components/createGroupInvitationBtn";
import { GET_USER_BY_USERNAME } from "../../../graphQL/queries/remote/accounts";
import gql from "graphql-tag";

const getUsersToInviteArr = gql`
  query getUsersToInviteArr {
    usersToInvite @client {
      __typename
      uuid
      username
    }
  }
`;

const animateIn = keyframes`
  0% {
    transform: translateX(-100%)
  }
  100% {
    transform: translateX(0%)
  }
`;

const Container = styled.div`
  position: absolute;
  top: 0;
  width: 30rem;
  height: 88vh;
  background: lime;
  animation-duration: 0.4s;
  animation-timing-function: ease-in-out;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: forwards;
  animation-play-state: running;
  animation-name: ${animateIn};
`;

// set Date.now() for setDate when createGroupInvitation function is invoked.
class CreateGroupInvitationController extends PureComponent {
  state = {
    username: "",
    groupUuid: "",
    inviteeUuid: ""
  };

  updateUsername = e => {
    this.setState({
      username: e.target.value
    });
  };

  getUserByUsername = async client => {
    const { data } = await client.query({
      query: GET_USER_BY_USERNAME,
      variables: {
        input: { username: this.state.username }
      }
    });
    const response = client.readQuery({ query: getUsersToInviteArr });
    // console.log("THE RESULT OF Retrieving the list: ", response.usersToInvite);
    client.writeData({
      data: {
        usersToInvite: [...response.usersToInvite, data.getUserByUsername]
      }
    });
    // console.log("THE RESULT IN GET USER BY USERNAME METHOD: ", data);
  };

  updateGroupInvitations = (cache, { data: { createGroup } }) => {
    console.log("GOT THE createGroup data in update: ", createGroup);
    const { title, members } = createGroup;
    // change to updateGroupInvitations
    this.props.updateGroups({
      variables: { input: { title, members } }
    });
  };

  createGroupInvitation = CREATE_GROUP_INVITATION => {
    CREATE_GROUP_INVITATION({
      variables: {
        input: { title: this.state.createGroupInput.title }
      }
    });
  };

  update = (cache, { data }) => {
    console.log("THE DATA IN UPDATE: ", data);
  };

  render() {
    const { username } = this.state;
    const { onClick } = this.props;
    const {
      updateUsername,
      updateGroupInvitations,
      createGroupInvitation
    } = this;
    return (
      // Create a nested component which will query for the list of users to inviteeUuid
      // and which will have a button that will send a mutation to actually create the invitation
      <ApolloConsumer>
        {client => {
          // if (data) {
          //   client.readQuery();
          //   client.writeData({ data: { usersToInvite: [] } });
          // }
          return (
            <Container>
              <span onClick={onClick}>Close</span>
              <h3>Get User By Username</h3>
              <input type="text" value={username} onChange={updateUsername} />
              <button onClick={() => this.getUserByUsername(client)}>
                Get User
              </button>
            </Container>
          );
        }}
      </ApolloConsumer>
    );
  }
}

export default CreateGroupInvitationController;
