import React, { Component } from "react";

export default class additionalOptions extends Component {
  render() {
    return (
      <div>
        <button onClick={this.createGroup}>Create Group</button>
      </div>
    );
  }
}
