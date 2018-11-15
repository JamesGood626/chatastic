import React from "react";
import styled from "styled-components";
import Navbar from "./containers/navbar";

const Container = styled.div`
  display: flex;
`;

const chatInterface = () => {
  return (
    <Container>
      <Navbar />
      <h1>Chat Interface</h1>
    </Container>
  );
};

export default chatInterface;
