import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import client from "./graphQL/client";
// import getAuthenticatedUser from './graphQL/queries/local/accounts'
import Main from "./Main";
import "./reset.css";

// Remember to run all tests in order to execute the tests.
// Also, it'd be fucking great if you'd just do a write up on how
// you set the testing up for this shiz.
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
