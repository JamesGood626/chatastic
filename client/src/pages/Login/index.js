import React from "react";
import styled from "styled-components";
import LoginForm from "./class-components/LoginForm";

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const login = () => {
  return (
    <Main>
      <LoginForm />
    </Main>
  );
};

export default login;
