import React, { Component } from "react";
import { Mutation, graphql, compose } from "react-apollo";
import CreateGroupInvitationBtn from "../fun-components/createGroupInvitationBtn";
import { GET_USER_BY_USERNAME } from "../../../graphQL/mutations/remote/accounts";

// set Date.now() for setDate when createGroupInvitation function is invoked.
export default class createGroupInvitationController extends Component {
  state = {
    username: "",
    groupUuid: "",
    inviteeUuid: ""
  };

  componentDidUpdate = (prevProps, prevState) => {
    console.log("HAS STATE UPDATED?");
  };

  updateUsername = e => {
    console.log("USERNAME IS NOT UPDATING");
    this.setState({
      username: e.target.value
    });
  };

  getUserByUsername = GET_USER_BY_USERNAME => {
    console.log("WHY IS THIS EXECUTING?");
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

  render() {
    const { username } = this.state;
    const {
      updateUsername,
      updateGroupInvitations,
      createGroupInvitation
    } = this;
    return (
      <Mutation mutation={GET_USER_BY_USERNAME}>
        {(getUserByUsername, { data, client }) => {
          return (
            <>
              <input type="text" value={username} onChange={updateUsername} />
              <button onClick={() => this.getUserByUsername(getUserByUsername)}>
                Get User
              </button>
            </>
          );
        }}
      </Mutation>
    );
  }
}
