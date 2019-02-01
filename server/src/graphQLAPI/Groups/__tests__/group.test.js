process.env.TEST_SUITE = "group-test";
const request = require("supertest");
const { httpServer } = require("../../../app");
const User = require("../../Accounts/model/user");
const Group = require("../model/group");
const { dropCollection } = require("../../testHelpers");
const { createUserGQLRequest } = require("../../testHelpers/accountsRequest");
const {
  createGroupGQLRequest,
  getGroupGQLRequest
} = require("../../testHelpers/groupsRequest");
const { getUserByUsername } = require("../../Accounts/services");
const {
  retrieveGroupActivitiesList
} = require("../../GroupActivities/services");

const user = {
  firstname: "Joe",
  lastname: "Salmon",
  username: "joesal",
  password: "sardines"
};

const groupOne = {
  title: "Group One"
};

const groupTwo = {
  title: "Group Two"
};

describe("With the Group resource a user may issue a GraphQL request to", () => {
  let createdRequest;
  let server;

  beforeAll(async done => {
    server = await httpServer.listen(3003);
    createdRequest = await request.agent(server);
    done();
  });

  afterEach(async done => {
    await dropCollection(Group);
    await dropCollection(User);
    done();
  });

  afterAll(async done => {
    await server.close(done);
  });

  test("create a group and a corresponding group activity", async done => {
    const {
      authenticatedUser: { token }
    } = await createUserGQLRequest(createdRequest, user);
    const { uuid, title, creatorUsername } = await createGroupGQLRequest(
      createdRequest,
      token,
      groupOne
    );
    const retrievedCreator = await getUserByUsername(creatorUsername);
    expect(title).toBe("Group One");
    // expect(retrievedCreator.groups[0].title).toBe("Group One");
    expect(retrievedCreator.groups.length).toBe(1);
    expect(retrievedCreator.groupActivities.length).toBe(1);
    // expect(retrievedCreator.groupActivities[0].groupUuid).toBe(uuid);
    done();
  });

  // Add a test for creating subsequent groups and ensuring that the array is
  // being added to, and not overwritten. -> perhaps later

  test("get group by uuid", async done => {
    const {
      authenticatedUser: { token }
    } = await createUserGQLRequest(createdRequest, user);
    const { uuid } = await createGroupGQLRequest(
      createdRequest,
      token,
      groupOne
    );
    const getGroupInput = {
      groupUuid: uuid
    };
    const { title, uuid: retrievedGroupUuid } = await getGroupGQLRequest(
      createdRequest,
      getGroupInput
    );
    expect(title).toBe("Group One");
    expect(uuid).toBe(retrievedGroupUuid);
    done();
  });
});
