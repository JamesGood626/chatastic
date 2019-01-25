import React, { Component } from "react";
import styled from "styled-components";
import TweenMax from "gsap";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
  height: 100%;
  background: ${props => props.bgColor === "green" && "#35eb7e"};
  background: ${props => props.bgColor === "white" && "#fcfcfc"};

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
    offsetLeft: null,
    showController: false
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

  toggleShowController = () => {
    this.setState((state, props) => ({
      showController: !state.showController
    }));
  };

  animateOut = () => {
    const { offsetLeft } = this.state;
    TweenMax.fromTo(
      this.container.current,
      0.4,
      { left: "0px", width: "100%" },
      { left: offsetLeft, width: "25%" }
    );
    TweenMax.set(this.container.current, {
      position: "static",
      width: "25%"
    });
  };

  onMouseOver = e => {
    const { showController } = this.state;
    if (!showController) {
      const { offsetLeft } = this.state;
      TweenMax.fromTo(
        this.container.current,
        0.4,
        { left: offsetLeft, width: "25%" },
        { left: "0px", width: "100%" }
      );
      TweenMax.set(this.container.current, {
        position: "absolute",
        width: "100%"
      });
    }
  };

  onMouseOut = e => {
    if (this.state.showController) {
      return;
    }
    this.animateOut();
  };

  onClick = e => {
    if (!this.state.showController) {
      TweenMax.set(this.container.current, { width: "100%" });
    }
    if (this.state.showController) {
      this.animateOut();
    }
    this.toggleShowController();
  };

  render() {
    const { onMouseOver, onMouseOut, onClick } = this;
    const { children, bgColor } = this.props;
    const { offsetLeft, showController } = this.state;
    return (
      <Container
        ref={this.container}
        bgColor={bgColor}
        offsetLeft={offsetLeft}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={!showController ? onClick : null}
      >
        {children(this.state.showController, onClick)}
      </Container>
    );
  }
}

export default OptionTab;
