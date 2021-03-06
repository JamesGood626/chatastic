import React, { Component } from "react";
import { Redirect } from "@reach/router";
import styled from "styled-components";
import { Mutation, graphql, compose } from "react-apollo";
// import { updateMapPosition } from "../GraphQL/localMutations";
import { CREATE_USER } from "../../../graphQL/mutations/remote/accounts";
import { updateAuthenticatedUser } from "../../../graphQL/mutations/local/accounts";
import InputField from "../../sharedComponents/inputField";

console.log("GOT CREATE_USER: ", CREATE_USER);
const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 22rem;
  height: 26rem;
  color: #093824;
  background: #fefffe;
  border-radius: 10px;
  box-shadow: 0px 0px 20px #aaa;

  & > button {
    width: 14rem;
    height: 2.8rem;
    font-size: 1.2rem;
    border: none;
    color: #fcfcfc;
    background: #093824;
  }

  & > button:hover {
    color: #093824;
    background: #fcfcfc;
    border: 2px solid #093824;
  }
`;

const H3 = styled.h3`
  font-size: 2rem;
  margin-bottom: 0.8rem;
  margin-top: 0;
`;

const initialState = {
  firstname: "",
  lastname: "",
  username: "",
  password: ""
};

class Signup extends Component {
  state = initialState;

  resetState = () => {
    this.setState(initialState);
  };

  updateState = e => {
    const { id, value } = e.target;
    this.setFieldState(id, value);
  };

  setFieldState = (id, value) => {
    this.setState({
      [id]: value
    });
  };

  // submitCreateUser = e => {
  //   e.preventDefault();
  //   createUser({ variables: { type: this.state } });
  //   this.resetState();
  // };

  render() {
    return (
      <Mutation
        mutation={CREATE_USER}
        update={(cache, { data: { createUser } }) => {
          console.log("GOT THE createUser data in update: ", createUser);
          this.props.updateAuthenticatedUser({
            variables: { input: createUser }
          });
          // const { todos } = cache.readQuery({ query: GET_TODOS });
          // cache.writeQuery({
          //   query: GET_TODOS,
          //   data: { todos: todos.concat([createUser]) }
          // });
        }}
      >
        {(createUser, { data }) => {
          if (data) {
            return <Redirect to="/chat" />;
          }
          return (
            <div>
              <Form
                onSubmit={e => {
                  e.preventDefault();
                  createUser({ variables: { input: this.state } });
                  this.resetState();
                }}
              >
                <H3>Sign Up</H3>
                <InputField
                  inputId="firstname"
                  labelText="First Name:"
                  updateState={this.updateState}
                />
                <InputField
                  inputId="lastname"
                  labelText="Last Name:"
                  updateState={this.updateState}
                />
                <InputField
                  inputId="username"
                  labelText="User Name:"
                  updateState={this.updateState}
                />
                <InputField
                  inputId="password"
                  labelText="Password:"
                  updateState={this.updateState}
                  type="password"
                />
                <button type="submit">Submit</button>
              </Form>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

// export default Signup;

export default compose(
  graphql(updateAuthenticatedUser, { name: "updateAuthenticatedUser" })
)(Signup);
