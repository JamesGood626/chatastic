import gql from "graphql-tag";

const accountsInputTypes = gql`
  input CreateUserInput {
    firstname: String!
    lastname: String!
    username: String!
    password: String!
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation createUserOp($input: CreateUserInput!) {
    createUser(input: $input) {
      firstname
      lastname
      username
      token
      uuid
      chats {
        channel
      }
    }
  }
`;

export const ALL_USERS = gql`
  query {
    allUsers {
      id
      firstname
      lastname
      username
      password
    }
  }
`;
