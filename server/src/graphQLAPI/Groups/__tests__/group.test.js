const request = require("supertest");
const { httpServer, apolloServer, app } = require("../../../app");
const {
  graphQLQueryRequest,
  graphQLMutationRequest,
  postRequest,
  postRequestWithHeaders,
  dropUserCollection,
  dropGroupCollection,
  createUserGraphQLRequest,
  loginUserGraphQLRequest
} = require("../../testHelpers");
// const { resetGroups } = require("../services");

const user = {
  firstname: "Joe",
  lastname: "Salmon",
  username: "joesal",
  password: "sardines"
};

const groupOne = {
  channel: "1",
  title: "Group One",
  creationDate: Date.now()
};

const groupTwo = {
  channel: "2",
  title: "Group Two"
};

const allGroupsQuery = `query allGroupsOp{
  allGroups {
    id
    channel
    title
  }
}`;

const createGroupMutation = `mutation createGroupOp($input: CreateGroupInput!) {
  createGroup(input: $input) {
    id
    channel
    title
    creator {
      username
    }
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

const createGroupGraphQLRequest = async (
  createdRequest,
  token,
  group = groupOne
) => {
  const operationInfo = await graphQLMutationRequest(
    group,
    createGroupMutation,
    "createGroupOp"
  );
  const response = await postRequestWithHeaders(
    createdRequest,
    operationInfo,
    token
  );

  return response;
};

describe("With Group resources a user may", () => {
  let createdRequest;
  let server;

  beforeAll(async done => {
    server = await httpServer.listen(2000);
    createdRequest = await request.agent(server);
    done();
  });

  afterEach(async done => {
    await dropUserCollection();
    await dropGroupCollection();
    done();
  });

  afterAll(async done => {
    await server.close(done);
  });

  test("create a group", async done => {
    const createUserResponse = await createUserGraphQLRequest(
      createdRequest,
      user
    );
    const { token } = createUserResponse.body.data.createUser;
    const response = await createGroupGraphQLRequest(createdRequest, token);
    const { channel, title, creator } = response.body.data.createGroup;
    expect(channel).toBe("1");
    expect(title).toBe("Group One");
    expect(creator.username).toBe("joesal");
    done();
  });

  // test("get all groups", async done => {
  //   await createGroupGraphQLRequest(createdRequest, groupTwo);
  //   const response = await allGroupsGraphQLRequest(createdRequest);
  //   expect(response.body.data.allGroups.length).toBe(2);
  //   done();
  // });
});
