import React, { Component } from "react";
import CreateGroupBtn from "../fun-components/createGroupBtn";

class createGroupController extends Component {
  state = {
    title: ""
  };

  updateGroupInputTitle = e => {
    this.setState({
      title: e.target.value
    });
  };

  updateGroups = (cache, { data: { createGroup } }) => {
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
        input: { title: this.state.title }
      }
    });
  };

  render() {
    const { title } = this.state;
    const { updateGroups, createGroup, updateGroupInputTitle } = this;
    return (
      <CreateGroupBtn
        updateGroups={updateGroups}
        createGroup={createGroup}
        onChange={updateGroupInputTitle}
        inputVal={title}
      />
    );
  }
}

export default createGroupController;
