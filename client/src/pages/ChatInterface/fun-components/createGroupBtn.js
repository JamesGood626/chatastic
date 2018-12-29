import React from "react";
import styled from "styled-components";
import { Mutation, graphql, compose } from "react-apollo";
import { CREATE_GROUP } from "../../../graphQL/mutations/remote/groups";
import InputField from "../../sharedComponents/inputField";
import { getGroups } from "../../../graphQL/queries/local/groups";

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

// LAST THING I TRIED ON WED DEC 4th
// added refetchQueries to see if I could refetch for getGroups because
// I'm using compose to get multiple queries at once in the navbar component
// the call to graphql returns a query-hoc.. which then wraps the navbar.
// The query-hoc is using the Query render prop component under the hood.
// BUT it doesn't appear as though the refetchQueries prop that I just placed
// here is even having an affect on those Query components doing a refetch.
// Perhaps this is due to the getGroups query being compose with three others in navbar
// Perhaps all four of the documents are being merged, and so the structure doesn't match
// and that's why the refetchQueries={[{ query: getGroups }]} doesn't work.
const createGroupButton = ({
  createGroup,
  updateGroups,
  onChange,
  inputVal
}) => {
  return (
    <Mutation
      mutation={CREATE_GROUP}
      update={updateGroups}
      // refetchQueries={[{ query: getGroups }]}
    >
      {(CREATE_GROUP, { data, client }) => {
        console.log("data: ", data);
        return (
          <Container>
            <input type="text" value={inputVal} onChange={onChange} />
            <button
              data-testid="create-group-submit-btn"
              onClick={e => {
                e.preventDefault();
                console.log("CREATE_GROUP IN THE ONCLICK: ", CREATE_GROUP);
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
