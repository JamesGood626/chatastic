import gql from "graphql-tag";

export const updateAuthenticatedUser = gql`
  mutation updateAuthenticatedUser($input: AuthenticatedUser!) {
    updateAuthenticatedUser(input: $input) @client {
      uuid
      firstname
      lastname
      username
      token
    }
  }
`;
