import React from "react";
import styled from "styled-components";
import SignUpForm from "./containers/SignUpForm";

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const signUp = () => {
  return (
    <Main>
      <SignUpForm />
    </Main>
  );
};

export default signUp;
