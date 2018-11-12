const request = require("supertest");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../../config");
const { httpServer, apolloServer } = require("../../../app");
const {
  graphQLQueryRequest,
  graphQLMutationRequest,
  postRequest,
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

const allUsersQuery = `query allUsersOp{
                        allUsers {
                          id
                          firstname
                          lastname
                          username
                          password
                        }
                      }`;

// const allUsersGraphQLRequest = async createdRequest => {
//   const operationInfo = await graphQLQueryRequest(allUsersQuery, "allUsersOp");
//   const response = await postRequest(createdRequest, operationInfo);
//   return response;
// };

describe("Test product CRUD Operations via GraphQL queries and mutations", () => {
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
    const { firstname, lastname, token } = response.body.data.createUser;
    expect(firstname).toBe("Sam");
    expect(lastname).toBe("Holland");
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
    const { firstname, lastname, token } = response.body.data.loginUser;
    expect(firstname).toBe("Sam");
    expect(lastname).toBe("Holland");
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(150);
    done();
  });

  // get user by email for invitation purposes if time allows
});
