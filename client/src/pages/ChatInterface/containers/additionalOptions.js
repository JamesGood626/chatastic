import React, { Component } from "react";
import InputField from "../../sharedComponents/inputField";

const initialState = {
  toggleOptions: false
};

export default class additionalOptions extends Component {
  state = initialState;
  render() {
    return (
      <div>
        <InputField
          inputId="userSearch"
          labelText="Search Users:"
          updateState={this.updateState}
        />
        <button onClick={this.createGroup}>Create Group</button>
      </div>
    );
  }
}
