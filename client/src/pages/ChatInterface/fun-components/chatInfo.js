import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 3rem;
  background: orange;
`;

const chatInfo = () => {
  return (
    <Container>
      <h1>Chatastic</h1>
    </Container>
  );
};

export default chatInfo;
