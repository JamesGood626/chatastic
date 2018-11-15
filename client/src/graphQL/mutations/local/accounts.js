import gql from "graphql-tag";

export const updateAuthenticatedUser = gql`
  mutation updateAuthenticatedUser($input: AuthenticatedUser!) {
    updateAuthenticatedUser(input: $input) @client {
      firstname
      lastname
      username
      password
      uuid
      token
    }
  }
`;
