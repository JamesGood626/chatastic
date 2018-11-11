const request = require("supertest");
const { httpServer, apolloServer, app } = require("../../../app");
const {
  graphQLQueryRequest,
  graphQLMutationRequest,
  postRequest
} = require("../../testHelpers");
const { resetGroups } = require("../services");

// input CreateGroupInput {
//   id: Int!
//   channelId: Int!
//   title: String!
// }

const groupOne = {
  channelId: "1",
  title: "Group One"
};

const groupTwo = {
  channelId: "2",
  title: "Group Two"
};

const allGroupsQuery = `query allGroupsOp{
  allGroups {
    id
    channelId
    title
  }
}`;

const createGroupMutation = `mutation createGroupOp($input: CreateGroupInput!) {
  createGroup(input: $input) {
    id
    channelId
    title
  }
}`;

const allGroupsGraphQLRequest = async createdRequest => {
  const operationInfo = await graphQLQueryRequest(
    allGroupsQuery,
    "allGroupsOp"
  );
  const response = await postRequest(createdRequest, operationInfo);
  return response;
};

const createGroupGraphQLRequest = async (createdRequest, group = groupOne) => {
  const operationInfo = await graphQLMutationRequest(
    group,
    createGroupMutation,
    "createGroupOp"
  );
  const response = await postRequest(createdRequest, operationInfo);
  return response;
};

describe("Test product CRUD Operations via GraphQL queries and mutations", () => {
  let createdRequest;
  let server;

  beforeAll(async done => {
    server = await httpServer.listen(2000);
    createdRequest = await request.agent(server);
    done();
  });

  afterEach(() => {
    resetGroups();
  });

  afterAll(async done => {
    await server.close(done);
  });

  test("create a group", async done => {
    const response = await createGroupGraphQLRequest(createdRequest);
    console.log("THE RESPONSE BODY: ", response.body);
    expect(response.body.data.createGroup.title).toBe("Group One");
    done();
  });

  // test("get all groups", async done => {
  //   await createGroupGraphQLRequest(createdRequest, groupTwo);
  //   const response = await allGroupsGraphQLRequest(createdRequest);
  //   expect(response.body.data.allGroups.length).toBe(2);
  //   done();
  // });
});
