import React, { Component } from "react";
import { gql } from "apollo-boost";
import { Subscription } from "react-apollo";

const USER_CREATED = gql`
  subscription userCreated($channelId: Int!) {
    userCreated(channelId: $channelId) {
      id
      firstname
    }
  }
`;

export default class messageList extends Component {
  componentDidMount() {
    this.props.subscribeToMore({
      document: USER_CREATED,
      // variables: { channelId: 1 },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        return {
          allUsers: [subscriptionData.data.userCreated, ...prev.allUsers]
        };
      }
    });
  }

  render() {
    return (
      <div>
        <h1>USERS</h1>
        {this.props.users.map(user => (
          <div key={user.id}>
            <div>
              {user.firstname} {user.lastname}
            </div>
            <Subscription
              subscription={USER_CREATED}
              variables={{ channelId: 1 }}
            >
              {subscriptionData => {
                console.log("SUBSCRIPTION");
                console.log("THE subscriptionData: ", subscriptionData.data);
                return null;
              }}
            </Subscription>
          </div>
        ))}
      </div>
    );
  }
}
