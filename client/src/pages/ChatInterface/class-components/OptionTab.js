import React, { Component } from "react";
import styled, { keyframes } from "styled-components";
import TweenMax from "gsap";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
  height: 100%;
  background: ${props => props.bgColor === "green" && "#35eb7e"};
  background: ${props => props.bgColor === "white" && "#fcfcfc"};
  animation-duration: 0.8s;
  animation-timing-function: ease-in-out;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: forwards;
  animation-play-state: running;

  h3 {
    pointer-events: none;
  }
  &:hover {
    position: absolute;
  }
`;

class OptionTab extends Component {
  container = React.createRef();
  state = {
    offsetLeft: null
  };

  componentDidMount = () => {
    let offsetLeft = this.container.current.offsetLeft;
    offsetLeft = `${offsetLeft}px`;
    this.setOffsetLeft(offsetLeft);
  };

  setOffsetLeft = offsetLeft => {
    this.setState({
      offsetLeft
    });
  };

  onMouseOver = e => {
    const { offsetLeft } = this.state;
    TweenMax.fromTo(
      this.container.current,
      0.4,
      { left: offsetLeft, width: "25%" },
      { left: "0px", width: "100%" }
    );
  };

  onMouseOut = e => {
    const { offsetLeft } = this.state;
    TweenMax.fromTo(
      this.container.current,
      0.4,
      { left: "0px", width: "100%" },
      { left: offsetLeft, width: "25%" }
    );
  };

  render() {
    const { onMouseOver, onMouseOut } = this;
    const { id, children, bgColor } = this.props;
    const { offsetLeft } = this.state;
    return (
      <Container
        id={id}
        ref={this.container}
        bgColor={bgColor}
        offsetLeft={offsetLeft}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      >
        {children}
      </Container>
    );
  }
}

export default OptionTab;
