import React, { Component } from "react";
import styled from "styled-components";
import ChatInfo from "../fun-components/chatInfo";
import MessageFeed from "../fun-components/messageFeed";
import MessageInput from "../fun-components/messageInput";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

class Chat extends Component {
  render() {
    return (
      <Container>
        <ChatInfo />
        <MessageFeed />
        <MessageInput />
      </Container>
    );
  }
}

export default Chat;
