import React from "react";
import styled from "styled-components";
import Navbar from "./class-components/navbar";
import Chat from "./class-components/chat";

const Container = styled.div`
  display: flex;
`;

const chatInterface = () => {
  return (
    <Container>
      <Navbar />
      <Chat />
    </Container>
  );
};

export default chatInterface;
