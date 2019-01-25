import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: purple;
`;

const messageFeed = () => {
  return (
    <Container>
      <h3>A bonafide message feed.</h3>
    </Container>
  );
};

export default messageFeed;
