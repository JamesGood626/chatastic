const request = require("supertest");
const { httpServer, apolloServer, app } = require("../../../app");
const {
  graphQLQueryRequest,
  graphQLQueryWithVariablesRequest,
  graphQLMutationRequest,
  postRequest,
  postRequestWithHeaders,
  dropUserCollection,
  dropGroupCollection,
  createUserGraphQLRequest,
  loginUserGraphQLRequest,
  createGroupGraphQLRequest,
  getGroupGraphQLRequest
} = require("../../testHelpers");
// const { resetGroups } = require("../services");

const user = {
  firstname: "Joe",
  lastname: "Salmon",
  username: "joesal",
  password: "sardines"
};

const groupOne = {
  title: "Group One",
  creationDate: Date.now()
};

const groupTwo = {
  title: "Group Two"
};

describe("With the Group resource a user may issue a GraphQL request to", () => {
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
    const response = await createGroupGraphQLRequest(
      createdRequest,
      token,
      groupOne
    );
    const { title, creator } = response.body.data.createGroup;
    expect(title).toBe("Group One");
    expect(creator.username).toBe("joesal");
    expect(creator.groups.length).toBe(1);
    expect(creator.groups[0].title).toBe("Group One");
    done();
  });

  test("get group by uuid", async done => {
    const createUserResponse = await createUserGraphQLRequest(
      createdRequest,
      user
    );
    const { token } = createUserResponse.body.data.createUser;
    const createGroupResponse = await createGroupGraphQLRequest(
      createdRequest,
      token,
      groupOne
    );
    const { uuid } = createGroupResponse.body.data.createGroup;
    const getGroupInput = {
      groupUuid: uuid
    };
    const response = await getGroupGraphQLRequest(
      createdRequest,
      getGroupInput
    );
    const { title } = response.body.data.getGroup;
    expect(title).toBe("Group One");
    done();
  });
});
