import React, { Fragment } from "react";
import styled from "styled-components";

const Span = styled.span`
  position: relative;
  margin: 0.8rem 0;
`;

const Label = styled.label`
  position: absolute;
  top: 20%;
  left: 2.5%;
  font-size: 1.1rem;
  transition: all 0.3s ease;
`;

const Input = styled.input`
  width: 14rem;
  height: 2.2rem;
  padding-left: 0.4rem;
  font-size: 1rem;
  border: 1px solid #093824;
  background: transparent;

  &:focus {
    outline: none;
    box-shadow: inset 0 0 2px #27fb6b, inset 0 0 2px #27fb6b;
    border: none;
  }
`;

const inputField = ({ inputId, labelText, updateState, type = "text" }) => {
  // Need to toggle this. See if hooks can help.
  const formLabelTransition = {
    top: "-1.2rem",
    left: 0,
    fontSize: "0.8rem"
  };

  return (
    <Span>
      <Label htmlFor={inputId} style={formLabelTransition}>
        {labelText}
      </Label>
      <Input id={inputId} type={type} onChange={updateState} />
    </Span>
  );
};

export default inputField;
