const request = require("supertest");
const { httpServer, apolloServer, app } = require("../../../app");
const {
  graphQLQueryRequest,
  graphQLMutationRequest,
  postRequest
} = require("../../testHelpers");
const { createUser } = require("../services");

// NOTE: write this down in ipad for later reference
// There was a slight difference in what I had to implement
// to get tests to work from what I did in nodeCommerce
// I already had this in nodeCommerce tests:
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// But I was adding .type('form') to the createdRequest
// . chain, and my mutation's input wasn't being parsed
// appropriately. Removing that did the trick.

const userOne = {
  id: 1,
  channelId: 1,
  firstname: "Sam",
  lastname: "Holland",
  username: "ShSquared",
  password: "supa-secret"
};

const userTwo = {
  id: 2,
  channelId: 1,
  firstname: "Veronica",
  lastname: "Moneymaker",
  username: "Dollabills",
  password: "supa-secret"
};

const allUsersQuery = `query allUsersOp{
                        allUsers {
                          id
                          firstname
                          lastname
                          username
                          password
                        }
                      }`;

const createUserMutation = `mutation createUserOp($input: CreateUserInput!) {
                              createUser(input: $input) {
                                id
                                firstname
                                lastname
                                username
                                password
                              }
                            }`;

const allUsersGraphQLRequest = async createdRequest => {
  const operationInfo = await graphQLQueryRequest(allUsersQuery, "allUsersOp");
  const response = await postRequest(createdRequest, operationInfo);
  return response;
};

const createUserGraphQLRequest = async (createdRequest, user = userOne) => {
  const operationInfo = await graphQLMutationRequest(
    user,
    createUserMutation,
    "createUserOp"
  );
  const response = await postRequest(createdRequest, operationInfo);
  return response;
};

describe("Test product CRUD Operations via GraphQL queries and mutations", () => {
  let createdRequest;
  let server;

  beforeAll(async done => {
    server = await httpServer.listen(5000, done);
    createdRequest = await request.agent(server);
    // console.log("THE createdRequest: ", createdRequest);
  });

  beforeEach(async () => {
    // await dropUserCollection(); create this in services to clear in memory storage
  });

  afterAll(async done => {
    await server.close(done);
  });

  test("get all users", async done => {
    await createUserGraphQLRequest(createdRequest);
    await createUserGraphQLRequest(createdRequest, userTwo);
    const response = await allUsersGraphQLRequest(createdRequest);
    expect(response.body.data.allUsers.length).toBe(2);
    done();
  });

  test("create a user", async done => {
    const response = await createUserGraphQLRequest(createdRequest);
    expect(response.body.data.createUser.firstname).toBe("Sam");
    done();
  });

  // Get User by Id I'll test once mongoDB is implemented
});
