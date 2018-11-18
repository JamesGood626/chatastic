import React, { Component } from "react";
import { Mutation, graphql, compose } from "react-apollo";
import { CREATE_GROUP } from "../../../graphQL/mutations/remote/groups";
import InputField from "../../sharedComponents/inputField";
import { updateGroups } from "../../../graphQL/mutations/local/groups";

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
    title: "Best Group2"
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

  render() {
    return (
      <Mutation mutation={CREATE_GROUP} update={this.update}>
        {(CREATE_GROUP, { data, client }) => {
          console.log("THE CREATE GROUP DATA: ", data);
          return (
            <div>
              <button
                onClick={e => {
                  e.preventDefault();
                  console.log("CREATING USER BUTTON ONCLICK");
                  CREATE_GROUP({
                    variables: {
                      input: { title: this.state.createGroupInput.title }
                    }
                  });
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
  }
}

export default compose(
  graphql(updateGroups, {
    props: ({ data: { groups } }) => ({
      groups
    })
  })
)(additionalOptions);
