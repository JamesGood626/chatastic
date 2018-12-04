import React from "react";
import styled from "styled-components";
import { Mutation, graphql, compose } from "react-apollo";
import { CREATE_GROUP } from "../../../graphQL/mutations/remote/groups";
import InputField from "../../sharedComponents/inputField";

// Container's position will become absolute, z-index over 9000, and
// width expand when hovered, so as to take precedence over the other
// availableOptions' buttons. Also need some kind of icon for this button.
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 7rem;
  height: 5rem;
  background: #f9f9f9;
`;

const createGroupButton = ({
  createGroup,
  updateGroups,
  onChange,
  inputVal
}) => {
  return (
    <Mutation mutation={CREATE_GROUP} update={updateGroups}>
      {(CREATE_GROUP, { data, client }) => {
        console.log("THE CREATE GROUP DATA: ", data);
        return (
          <Container>
            <input type="text" value={inputVal} onChange={onChange} />
            <button
              onClick={e => {
                e.preventDefault();
                createGroup(CREATE_GROUP);
              }}
            >
              Create Group
            </button>
            {data ? <h1>{data.createGroup.title}</h1> : null}
          </Container>
        );
      }}
    </Mutation>
  );
};

export default createGroupButton;
