import React, { Component } from "react";
import { Mutation, graphql, compose } from "react-apollo";
// import { CREATE_GROUP } from "../../../graphQL/mutations/remote/groups";
// import InputField from "../../sharedComponents/inputField";
import { updateGroups } from "../../../graphQL/queries/local/groups";
import CreateGroupButton from "../components/createGroupButton";

{
  /* <InputField
  inputId="userSearch"
  labelText="Search Users:"
  updateState={this.updateState}
/> */
}

const initialState = {
  toggleOptions: false,
  createGroupInput: {
    title: "Best Group9001"
  }
};

class additionalOptions extends Component {
  state = initialState;

  update = (cache, { data: { createGroup } }) => {
    console.log("GOT THE createGroup data in update: ", createGroup);
    const { title, members } = createGroup;
    this.props.updateGroups({
      variables: { input: { title, members } }
    });
  };

  createGroup = CREATE_GROUP => {
    console.log("CREATING USER BUTTON ONCLICK");
    CREATE_GROUP({
      variables: {
        input: { title: this.state.createGroupInput.title }
      }
    });
  };

  // invite to group (needs to have search functionality)
  // create chat (creates a chat in the current group. Pass down the current group's uuid as a prop)
  //    - will also need to handle that initial state setup of setting the current group on
  //    - AdditionalOptions' state.
  // pending invitations
  // The components to render out the groups, chats, and members
  render() {
    return (
      <CreateGroupButton update={this.update} createGroup={this.createGroup} />
    );
  }
}

// If this approach doesn't work for updating the group list adtera new one is created then
// I can opt for refetching queries instead.
export default compose(
  graphql(updateGroups, {
    props: ({ data: { groups } }) => ({
      groups
    })
  })
)(additionalOptions);

// export default additionalOptions;
