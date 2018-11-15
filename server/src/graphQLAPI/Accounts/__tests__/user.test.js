const request = require("supertest");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../../config");
const { httpServer, apolloServer } = require("../../../app");
const {
  graphQLQueryRequest,
  graphQLQueryWithVariablesRequest,
  graphQLMutationRequest,
  postRequest,
  postRequestWithHeaders,
  dropUserCollection,
  createUserGraphQLRequest,
  loginUserGraphQLRequest
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
  firstname: "Sam",
  lastname: "Holland",
  username: "BamBamSam",
  password: "supa-secret"
};

const userTwo = {
  firstname: "Sarah",
  lastname: "Holland",
  username: "BamBamSar",
  password: "supa-secret"
};

const userLoginInput = {
  username: "BamBamSam",
  password: "supa-secret"
};

const userSearchInput = {
  username: "BamBamSam"
};

const userSearchQuery = `query getUserByUsernameOp ($input: UserSearchInput!) {
                          getUserByUsername (input: $input) {
                            uuid
                            firstname
                            lastname
                            username
                            message
                          }
                        }`;

const getUserByUsernameGraphQLRequest = async (
  createdRequest,
  token,
  userSearchInput
) => {
  const operationInfo = await graphQLQueryWithVariablesRequest(
    userSearchInput,
    userSearchQuery,
    "getUserByUsernameOp"
  );
  const response = await postRequestWithHeaders(
    createdRequest,
    operationInfo,
    token
  );
  return response;
};

describe("With the User resource a user may issue a GraphQL request to", () => {
  let createdRequest;
  let server;

  beforeAll(async done => {
    server = await httpServer.listen(1000);
    createdRequest = await request.agent(server);
    done();
  });

  afterEach(async done => {
    await dropUserCollection();
    done();
  });

  afterAll(async done => {
    await server.close(done);
  });

  // test("get all users", async done => {
  //   await createUserGraphQLRequest(createdRequest);
  //   await createUserGraphQLRequest(createdRequest, userTwo);
  //   const response = await allUsersGraphQLRequest(createdRequest);
  //   expect(response.body.data.allUsers.length).toBe(2);
  //   done();
  // });

  test("create a user", async done => {
    const response = await createUserGraphQLRequest(createdRequest, userOne);
    const {
      firstname,
      lastname,
      username,
      token
    } = response.body.data.createUser;
    expect(firstname).toBe("Sam");
    expect(lastname).toBe("Holland");
    expect(username).toBe("BamBamSam");
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(150);
    done();
  });

  test("login a user", async done => {
    await createUserGraphQLRequest(createdRequest, userOne);
    const response = await loginUserGraphQLRequest(
      createdRequest,
      userLoginInput
    );
    const {
      firstname,
      lastname,
      username,
      token
    } = response.body.data.loginUser;
    expect(firstname).toBe("Sam");
    expect(lastname).toBe("Holland");
    expect(username).toBe("BamBamSam");
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(150);
    done();
  });

  test("get a user by username", async done => {
    const createUserResponse = await createUserGraphQLRequest(
      createdRequest,
      userOne
    );
    const secondCreateUserResponse = await createUserGraphQLRequest(
      createdRequest,
      userTwo
    );
    const { token } = secondCreateUserResponse.body.data.createUser;
    const userSearchResponse = await getUserByUsernameGraphQLRequest(
      createdRequest,
      token,
      userSearchInput
    );
    // Pick up from here.
    console.log("THE USER SEARCH RESPONSE BODY: ", userSearchResponse.body);
    done();
  });
});
