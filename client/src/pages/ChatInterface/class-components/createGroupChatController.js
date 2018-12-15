import React, { PureComponent } from "react";
import { graphql, compose } from "react-apollo";
import styled, { keyframes } from "styled-components";
import { getGroups } from "../../../graphQL/queries/local/groups";
import { updateGroupChats } from "../../../graphQL/mutations/local/chats";
import CreateGroupBtn from "../fun-components/createGroupBtn";

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

// NOTHING IN HERE IS DIFFERENT FROM THE
// ***** CreateGroupController ****
// At the <moment
// Need to test.... and refactor EVERYTHING.
class CreateGroupChatController extends PureComponent {
  state = {
    title: "",
    animateOut: false
  };

  updateGroupInputTitle = e => {
    this.setState({
      title: e.target.value
    });
  };

  updateGroups = (cache, { data: { createGroup } }) => {
    console.log("GOT THE createGroup data in update: ", createGroup);
    const data = cache.readQuery({ query: getGroups });
    console.log("getGroups data in update: ", data);
    // Putting the newly created group on a copy of the previous cached groups array.
    data.groups = [...data.groups, createGroup];
    cache.writeQuery({ query: getGroups, data });
    // this.props.updateGroups({
    //   variables: { input: createGroup }
    // });
  };

  createGroup = CREATE_GROUP => {
    CREATE_GROUP({
      variables: {
        input: { title: this.state.title }
      }
    });
  };

  render() {
    const { title, animateOut } = this.state;
    // onClick used to close the div
    const { onClick } = this.props;
    const {
      updateGroups,
      createGroup,
      updateGroupInputTitle,
      animateOutAndClose
    } = this;
    return (
      <Container>
        <h4 onClick={onClick}>Close</h4>
        <CreateGroupBtn
          updateGroups={updateGroups}
          createGroup={createGroup}
          onChange={updateGroupInputTitle}
          inputVal={title}
        />
      </Container>
    );
  }
}

// export default CreateGroupController;

export default compose(graphql(updateGroupChats, { name: "updateGroupChats" }))(
  CreateGroupChatController
);
