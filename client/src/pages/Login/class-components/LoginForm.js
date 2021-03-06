import React, { Component } from "react";
import { Redirect } from "@reach/router";
import styled from "styled-components";
import { Mutation, graphql, compose } from "react-apollo";
import { LOGIN_USER } from "../../../graphQL/mutations/remote/accounts";
import { updateAuthenticatedUser } from "../../../graphQL/mutations/local/accounts";
import InputField from "../../sharedComponents/inputField";

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
  username: "good",
  password: "good"
};

class Login extends Component {
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

  componentDidUpdate = () => {
    console.log("LoginForm updated state");
    console.log(this.state);
  };

  // submitCreateUser = e => {
  //   e.preventDefault();
  //   createUser({ variables: { type: this.state } });
  //   this.resetState();
  // };

  update = (cache, { data: { loginUser } }) => {
    // So loginUser should have the:
    // groups
    // groupActivities
    // groupInvitations
    // Which I can destructure off and use other clientside resolvers
    // to update the cache with. -> And that state on the cache
    // is what my components that I mapped out in my notes will need
    // to fulfill their tasks!
    console.log("GOT THE loginUser data in update: ", loginUser);
    this.props.updateAuthenticatedUser({
      variables: { input: loginUser }
    });
    console.log("WTF?");
  };

  render() {
    return (
      <Mutation mutation={LOGIN_USER} update={this.update}>
        {(loginUser, { data }) => {
          console.log("ANYTHING?! ", data);
          if (data) {
            console.log("Hitting redirect");
            return <Redirect to="/chat" noThrow />;
          }
          return (
            <div>
              <Form
                onSubmit={e => {
                  e.preventDefault();
                  loginUser({ variables: { input: this.state } });
                  this.resetState();
                }}
              >
                <H3>Login</H3>
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
                <button type="submit" data-testid="login-submit-btn">
                  Submit
                </button>
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
)(Login);
