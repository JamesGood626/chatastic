process.env.TEST_SUITE = "groupInvitation-test";
const request = require("supertest");
const { httpServer } = require("../../../app");
const { dropCollection } = require("../../testHelpers");
const { createUserGQLRequest } = require("../../testHelpers/accountsRequest");
const {
  createGroupInvitationGQLRequest
} = require("../../testHelpers/groupInvitationsRequest");
const {
  loginAndCreateGroupSetup,
  loginAndAcceptGroupInvitation
} = require("../../testHelpers/groupInvitationsOperations");
const { getUserByUsername } = require("../../Accounts/services");
const Group = require("../../Groups/model/group");
const GroupInvitation = require("../model/groupInvitation");
const User = require("../../Accounts/model/user");

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

const loginInput = {
  username: "BamBamSar",
  password: "supa-secret"
};

const secondUserLoginInput = {
  username: "BamBamSam",
  password: "supa-secret"
};

const groupInput = {
  title: "The Group You Need"
};

const groupInvitationInput = {
  sentDate: Date.now()
};

describe("With the GroupInvitation resource a user may issue a GraphQL request to", () => {
  let createdRequest;
  let server;

  beforeAll(async done => {
    server = await httpServer.listen(3002);
    createdRequest = await request.agent(server);
    await createUserGQLRequest(createdRequest, userOne);
    await createUserGQLRequest(createdRequest, userTwo);
    done();
  });

  afterEach(async done => {
    await dropCollection(Group);
    await dropCollection(GroupInvitation);
    await dropCollection(User);
    done();
  });

  afterAll(async done => {
    await server.close(done);
  });

  test("create a group invitation sent from userTwo to userOne and have userOne accept invitation", async done => {
    const { token, groupUuid } = await loginAndCreateGroupSetup(
      createdRequest,
      loginInput,
      groupInput
    );
    // Find the invitee user
    const { uuid: userOneUuid } = await getUserByUsername("BamBamSam");
    groupInvitationInput.groupUuid = groupUuid;
    groupInvitationInput.inviteeUuid = userOneUuid;
    // uuid from this invitation creation used below in accept invitation input
    const { group, inviter, invitee } = await createGroupInvitationGQLRequest(
      createdRequest,
      token,
      groupInvitationInput
    );
    expect(group.title).toBe("The Group You Need");
    expect(inviter.firstname).toBe("Sarah");
    expect(invitee.firstname).toBe("Sam");
    // Ensure that both users have a groupInvitation
    // in their nested groupInvitations array.
    // Necessary to support UI indicators
    expect(inviter.groupInvitations.length).toBe(1);
    expect(invitee.groupInvitations.length).toBe(1);
    // Now for the invitee user to accept the invitation
    const {
      acceptedMessage,
      joinedGroup,
      groupInvitation
    } = await loginAndAcceptGroupInvitation(
      createdRequest,
      secondUserLoginInput
    );
    expect(groupInvitation.inviter.firstname).toBe("Sarah");
    expect(groupInvitation.invitee.firstname).toBe("Sam");
    expect(groupInvitation.group.title).toBe("The Group You Need");
    expect(acceptedMessage).toBe("Successfully joined.");
    // Now making sure the invitee was added to the group's members
    // and that the user's nested group now contains the newly joined group.
    expect(joinedGroup.uuid).toBe(groupUuid);
    expect(joinedGroup.members.length).toBe(2);
    expect(joinedGroup.members[0].firstname).toBe("Sam");
    expect(joinedGroup.members[0].groups[0].uuid).toBe(groupUuid);
    done();
  });
});
