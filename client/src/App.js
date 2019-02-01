import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import client from "./graphQL/client";
// import getAuthenticatedUser from './graphQL/queries/local/accounts'
import Main from "./Main";
import "./reset.css";

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Main />
      </ApolloProvider>
    );
  }
}

export default App;
