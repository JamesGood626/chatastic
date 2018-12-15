import React, { Component, Fragment } from "react";
import styled from "styled-components";
import { Mutation, graphql, compose } from "react-apollo";
// import { CREATE_GROUP } from "../../../graphQL/mutations/remote/groups";
// import InputField from "../../sharedComponents/inputField";
import { getGroups } from "../../../graphQL/queries/local/groups";
import OptionTab from "./OptionTab";
import CreateGroupController from "./createGroupController";
import CreateGroupChatController from "./createGroupChatController";
import CreateGroupInvitationController from "./createGroupInvitationController";

const CG = "create_group";
const CGC = "create_group_chat";
const CGI = "create_group_invitation";
const PGI = "pending_group_invitation";

const Container = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  min-height: 7rem;
  height: 7rem;
  border-top: 4px solid #333;
  border-bottom: 4px solid #333;
`;

{
  /* <InputField
  inputId="userSearch"
  labelText="Search Users:"
  updateState={this.updateState}
/> */
}

// createGroupInvitationInput: {
//   sentDate: Date.now(),
//   groupUuid: "123",
//   inviteeUuid: "123"
// }

class additionalOptions extends Component {
  state = {
    toggleOptions: false
  };

  // getOffsetLeft = e => {
  //   // console.log("THE TARGET OFFSET LEFT: ", e.target.offsetLeft);
  //   return e.target.offsetLeft;
  // };

  getOptionTabId = e => {
    console.log("THE E.TARGET.ID: ", e.target.id);
    return e.target.id;
  };

  // invite to group (needs to have search functionality)
  // create chat (creates a chat in the current group. Pass down the current group's uuid as a prop)
  //    - will also need to handle that initial state setup of setting the current group on
  //    - AdditionalOptions' state.
  // pending invitations
  // The components to render out the groups, chats, and members
  render() {
    const { getOptionTabId } = this;
    return (
      <Container>
        <OptionTab bgColor="white" getOptionTabId={getOptionTabId}>
          {(showController, onClick) => (
            <Fragment>
              <h3>CG</h3>
              {showController && <CreateGroupController onClick={onClick} />}
            </Fragment>
          )}
        </OptionTab>
        <OptionTab bgColor="green" getOptionTabId={getOptionTabId}>
          {(showController, onClick) => (
            <Fragment>
              <h3>CGC</h3>
              {showController && (
                <CreateGroupChatController onClick={onClick} />
              )}
            </Fragment>
          )}
        </OptionTab>
        <OptionTab bgColor="white" getOptionTabId={getOptionTabId}>
          {(showController, onClick) => (
            <Fragment>
              <h3>CGI</h3>
              {showController && (
                <CreateGroupInvitationController onClick={onClick} />
              )}
            </Fragment>
          )}
        </OptionTab>
        <OptionTab bgColor="green" getOptionTabId={getOptionTabId}>
          {showController => (
            <Fragment>
              <h3>PGI</h3>
            </Fragment>
          )}
        </OptionTab>
      </Container>
    );
  }
}

{
  /* <CreateGroupInvitationBtn
          update={this.updateGroupInvitations}
          createGroupInvitation={this.createGroupInvitation}
        /> */
}

// If this approach doesn't work for updating the group list adtera new one is created then
// I can opt for refetching queries instead.
export default compose(
  graphql(getGroups, {
    props: ({ data: { groups } }) => ({
      groups
    })
  })
)(additionalOptions);

// export default additionalOptions;
