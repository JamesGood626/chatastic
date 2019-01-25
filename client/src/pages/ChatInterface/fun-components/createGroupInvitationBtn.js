import React from "react";
import { Mutation, graphql, compose } from "react-apollo";
// need to search for user before creating group invitation
// a group invitation button will appear aside the retrieved user
import { CREATE_GROUP_INVITATION } from "../../../graphQL/mutations/remote/groupInvitations";
import InputField from "../../sharedComponents/inputField";

const createGroupInvitationButton = ({
  createGroupInvitation,
  update,
  inputVal
}) => {
  return (
    <Mutation mutation={CREATE_GROUP_INVITATION} update={update}>
      {(CREATE_GROUP_INVITATION, { data, client }) => {
        console.log("THE CREATE GROUP INVITATION DATA: ", data);
        return (
          <div>
            <input type="text" value={inputVal} />
            <button
              onClick={e => {
                e.preventDefault();
                createGroupInvitation(CREATE_GROUP_INVITATION);
              }}
            >
              Create Group Invitation
            </button>
            {data ? <h1>{data.createGroup.title}</h1> : null}
          </div>
        );
      }}
    </Mutation>
  );
};

export default createGroupInvitationButton;
