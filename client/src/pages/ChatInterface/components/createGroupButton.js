import React from "react";
import { Mutation, graphql, compose } from "react-apollo";
import { CREATE_GROUP } from "../../../graphQL/mutations/remote/groups";
import InputField from "../../sharedComponents/inputField";

const createGroupButton = ({ createGroup, update }) => {
  return (
    <Mutation mutation={CREATE_GROUP} update={update}>
      {(CREATE_GROUP, { data, client }) => {
        console.log("THE CREATE GROUP DATA: ", data);
        return (
          <div>
            <button
              onClick={e => {
                e.preventDefault();
                createGroup(CREATE_GROUP);
              }}
            >
              Create Group
            </button>
            {data ? <h1>{data.createGroup.title}</h1> : null}
          </div>
        );
      }}
    </Mutation>
  );
};

export default createGroupButton;
