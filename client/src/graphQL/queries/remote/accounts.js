import gql from "graphql-tag";

export const ALL_USERS = gql`
  query {
    allUsers {
      uuid
      firstname
      lastname
      username
    }
  }
`;

export const GET_USER_BY_USERNAME = gql`
  query getUserByUsernameOp($input: UserSearchInput!) {
    getUserByUsername(input: $input) {
      uuid
      firstname
      lastname
      username
    }
  }
`;
