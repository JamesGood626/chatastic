import gql from "graphql-tag";

export const updateGroups = gql`
  mutation updateGroups($input: Groups) {
    updateGroups(input: $input) @client {
      title
      members {
        username
      }
    }
  }
`;
