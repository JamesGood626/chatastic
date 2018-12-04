import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 4rem;
  width: 80%;
  background: yellow;
`;

const messageInput = () => {
  return (
    <Container>
      <h4>Here goes the message input</h4>
    </Container>
  );
};

export default messageInput;
