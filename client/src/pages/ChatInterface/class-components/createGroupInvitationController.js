import React, { PureComponent } from "react";
import styled, { keyframes } from "styled-components";
import { Mutation, graphql, compose } from "react-apollo";
import CreateGroupInvitationBtn from "../fun-components/createGroupInvitationBtn";
import { GET_USER_BY_USERNAME } from "../../../graphQL/mutations/remote/accounts";

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

  getUserByUsername = GET_USER_BY_USERNAME => {
    GET_USER_BY_USERNAME({
      variables: {
        input: { username: this.state.username }
      }
    });
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
      <Mutation mutation={GET_USER_BY_USERNAME} update={this.update}>
        {(getUserByUsername, { data, client }) => {
          if (data) {
            client.readQuery();
            client.writeData({ data: { usersToInvite: [] } });
          }
          console.log("DATA INSIDE OF THE MUTATION: ", data);
          return (
            <Container>
              <h4 onClick={onClick}>Close</h4>
              <input type="text" value={username} onChange={updateUsername} />
              <button onClick={() => this.getUserByUsername(getUserByUsername)}>
                Get User
              </button>
            </Container>
          );
        }}
      </Mutation>
    );
  }
}

export default CreateGroupInvitationController;
