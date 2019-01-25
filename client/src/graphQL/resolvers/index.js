import gql from "graphql-tag";

const resolvers = {
  // THIS WORKED!!!!! THE AUTOMATIC POLLING REFETCH NO GIVES AN ERROR
  // FOR REFETCHING THE AUTHENTICATED USER OUT OF THE CACHE.
  // And yeah commenting this out makes the error pop up again for
  // !!!!!!!!!! DOCUMENT THIS IN YOUR NOTES !!!!!!!!!!!
  // Steps of the component rendering look like this:
  // Component mounts
  // -> query is fetched
  // -> 10 second pause before re-polling
  // -> error occurs during re-polling(no data is returned from the query)
  // !!! ALSO NOTE !!!
  // That in the case of creating a group, updating the cache, and then
  // having the Section of my UI that uses the react-apollo Query component, that
  // I'm only querying the cache, then spreading the new state on the old cached
  // groups array, and then writing to the cache w/ writeQuery
  // -> Then that Query component automatically refetches for the getGroups query
  //  and the list rerenders without using a refetchQueries prop on the Mutation that
  //  creates the group.
  Query: {
    getAuthenticatedUser: (_, __, { cache }) => {
      console.log("THE CACHE IN THE GET AUTHENTICATED USER QUERY: ", cache);
      const query = gql`
        query getAuthenticatedUser {
          authenticatedUser @client {
            __typename
            uuid
            firstname
            lastname
            username
            token
          }
        }
      `;
      const cacheState = cache.readQuery({ query });
      console.log("THE RETRIEVED CACHE STATE: ", cacheState);
      return cacheState.authenticatedUser;
    }
  },
  Mutation: {
    updateAuthenticatedUser: (_, { input }, { cache }) => {
      const {
        firstname,
        lastname,
        username,
        uuid,
        token,
        groups,
        groupActivities,
        groupInvitations
      } = input;
      console.log("DA input: ", input);
      if (token) {
        localStorage.setItem("token", token);
      }
      const query = gql`
        query getAuthenticatedUser {
          authenticatedUser @client {
            __typename
            uuid
            firstname
            lastname
            username
            token
          }
        }
      `;
      const previousState = cache.readQuery({ query });
      console.log("PREVIOUS STATE: ", previousState);
      const data = {
        // ...previousState,
        authenticatedUser: {
          ...previousState.authenticatedUser,
          firstname,
          lastname,
          username,
          uuid,
          token
        },
        groups: groups[0] !== null ? groups : [],
        groupActivities: groupActivities[0] !== null ? groupActivities : [],
        groupInvitations: groupInvitations[0] !== null ? groupInvitations : []
      };
      console.log("NEW DATA: ", data);
      cache.writeData({ query, data });
      return data.authenticatedUser;
    },
    updateGroups: (_, { input }, { cache }) => {
      // const { firstname, lastname, username, uuid, token, chats } = input;
      console.log("input for updateGroups: ", input);
      const query = gql`
        query getGroups {
          groups @client {
            uuid
            title
            creator {
              username
            }
            members {
              username
            }
            chats {
              channel
              title
            }
          }
        }
      `;

      const previousState = cache.readQuery({ query });
      console.log("PREVIOUS STATE: ", previousState);
      const length = previousState.groups.length;
      console.log("THE LENGTH OF THE PREVIOUS STATE ARRAY: ", length);
      const newData = length > 0 ? [...previousState.groups, input] : [input];
      const data = {
        groups: newData
      };
      console.log("NEW DATA: ", data);
      cache.writeData({ query, data });
      console.log("DOES DATA GET WRITTEN TO CACHE?");
      const updatedState = cache.readQuery({ query });
      console.log("UPDATED STATE: ", updatedState);
      return newData;
    },
    updateGroups: (_, { input }, { cache }) => {
      // const { firstname, lastname, username, uuid, token, chats } = input;
      console.log("input for updateGroups: ", input);
      const query = gql`
        query getGroupChats {
          groupChats @client {
            uuid
            title
            creator {
              username
            }
            members {
              username
            }
            chats {
              channel
              title
            }
          }
        }
      `;

      const previousState = cache.readQuery({ query });
      console.log("PREVIOUS STATE: ", previousState);
      const length = previousState.groups.length;
      console.log("THE LENGTH OF THE PREVIOUS STATE ARRAY: ", length);
      const newData = length > 0 ? [...previousState.groups, input] : [input];
      const data = {
        groups: newData
      };
      console.log("NEW DATA: ", data);
      cache.writeData({ query, data });
      console.log("DOES DATA GET WRITTEN TO CACHE?");
      const updatedState = cache.readQuery({ query });
      console.log("UPDATED STATE: ", updatedState);
      return newData;
    }
  }
};

export default resolvers;
