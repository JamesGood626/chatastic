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
  let authToken;
  let groupUuid;
  let groupTitle;
  let groupCreatorUsername;

  beforeAll(async done => {
    server = await httpServer.listen(3003);
    createdRequest = await request.agent(server);
    const {
      authenticatedUser: { token }
    } = await createUserGQLRequest(createdRequest, user);
    const {
      group: { uuid, title, creatorUsername }
    } = await createGroupGQLRequest(createdRequest, token, groupOne);
    authToken = token;
    groupUuid = uuid;
    groupTitle = title;
    groupCreatorUsername = creatorUsername;
    done();
  });

  afterAll(async done => {
    await dropCollection(Group);
    await dropCollection(User);
    await server.close(done);
  });

  test("create a group and a corresponding group activity", async done => {
    const retrievedCreator = await getUserByUsername(groupCreatorUsername);
    expect(groupTitle).toBe("Group One");
    expect(retrievedCreator.groups.length).toBe(1);
    expect(retrievedCreator.groupActivities.length).toBe(1);
    done();
  });

  test("subsequent created groups are appended to the array", async done => {
    const {
      group: { title, creatorUsername }
    } = await createGroupGQLRequest(createdRequest, authToken, groupTwo);
    const retrievedCreator = await getUserByUsername(creatorUsername);
    expect(title).toBe("Group Two");
    expect(retrievedCreator.groups.length).toBe(2);
    expect(retrievedCreator.groupActivities.length).toBe(2);
    done();
  });

  // This operation is only necessary for when a user accepts a groupInvitation
  // in order to immediately display this group's title in the UI and have a reference
  // to it's uuid for later retrieving messages if the group is selected by the user in the
  // UI.
  test("get group by uuid", async done => {
    const getGroupInput = {
      groupUuid
    };
    const {
      group: { title, uuid: retrievedGroupUuid }
    } = await getGroupGQLRequest(createdRequest, getGroupInput);
    expect(title).toBe("Group One");
    expect(groupUuid).toBe(retrievedGroupUuid);
    done();
  });
});
