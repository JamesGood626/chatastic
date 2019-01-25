import React from "react";
import { Router } from "@reach/router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChatInterface from "./pages/ChatInterface";

export default function Main() {
  return (
    <Router>
      <Home path="/" />
      <Signup path="/signup" />
      <Login path="/login" />
      <ChatInterface path="/chat" />
    </Router>
  );
}
