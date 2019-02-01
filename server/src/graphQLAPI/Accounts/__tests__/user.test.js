process.env.TEST_SUITE = "user-test";
const request = require("supertest");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const { JWT_SECRET } = require("../../../config");
const { httpServer, apolloServer } = require("../../../app");
const { dropCollection } = require("../../testHelpers");
const {
  createUserGQLRequest,
  getUserByUsernameGQLRequest
} = require("../../testHelpers/accountsRequest");
const {
  createAndLoginUser,
  createTwoUsers
} = require("../../testHelpers/accountsOperations");

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

const userInput = {
  firstname: "Sam",
  lastname: "Holland",
  username: "BamBamSam",
  password: "supa-secret"
};

const userTwoInput = {
  firstname: "Sarah",
  lastname: "Holland",
  username: "BamBamSar",
  password: "supa-secret"
};

const loginInput = {
  username: "BamBamSam",
  password: "supa-secret"
};

const userSearchInput = {
  username: "BamBamSam"
};

describe("With the User resource a user may issue a GraphQL request to", () => {
  let createdRequest;
  let server;

  // test("1+1 = 2", () => {
  //   expect(1 + 1).toBe(2);
  // });

  beforeAll(async done => {
    server = await httpServer.listen(2000);
    createdRequest = await request.agent(server);
    done();
  });

  afterEach(async done => {
    await dropCollection(User);
    done();
  });

  afterAll(async done => {
    await server.close(done);
  });

  test("create a user", async done => {
    const {
      errors,
      authenticatedUser: { firstname, lastname, username, token }
    } = await createUserGQLRequest(createdRequest, userInput);
    expect(firstname).toBe("Sam");
    expect(lastname).toBe("Holland");
    expect(username).toBe("BamBamSam");
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(150);
    done();
  });

  test("login a user", async done => {
    const {
      errors,
      authenticatedUser: { firstname, lastname, username, token }
    } = await createAndLoginUser(createdRequest, userInput, loginInput);
    expect(firstname).toBe("Sam");
    expect(lastname).toBe("Holland");
    expect(username).toBe("BamBamSam");
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(150);
    done();
  });

  test("get a user by username", async done => {
    const {
      userTwoData: {
        authenticatedUser: { token }
      }
    } = await createTwoUsers(createdRequest, userInput, userTwoInput);
    const {
      user: { username }
    } = await getUserByUsernameGQLRequest(
      createdRequest,
      token,
      userSearchInput,
      true
    );
    expect(username).toBe(userSearchInput.username);
    done();
  });
});
