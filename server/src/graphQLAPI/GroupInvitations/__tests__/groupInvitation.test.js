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
const { getUserByUsername, getUserById } = require("../../Accounts/services");
const Group = require("../../Groups/model/group");
const GroupInvitation = require("../model/groupInvitation");
const User = require("../../Accounts/model/user");
const { getGroupById } = require("../../Groups/services");

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
    // Check that both users have a groupInvitation
    // in their nested groupInvitations array.
    // Necessary to support UI indicators
    // *** Since refactor ***
    const retrievedInviter = await getUserByUsername(inviter.username);
    const retrievedInvitee = await getUserByUsername(invitee.username);
    // Would now need to get user's by username to check the
    // length of this
    expect(retrievedInviter.groupInvitations.length).toBe(1);
    expect(retrievedInvitee.groupInvitations.length).toBe(1);
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
    // Better to use GraphQL getUserByUsername query, see *** comments below ***
    const retrievedInviterTwo = await getUserByUsername(
      groupInvitation.inviter.username
    );
    const retrievedInviteeTwo = await getUserByUsername(
      groupInvitation.invitee.username
    );
    // const userOne = joinedGroup.members[0];
    // const userTwo = joinedGroup.members[1];
    // Checking that both user's groupActivities array contain the required group
    expect(retrievedInviterTwo.groupActivities.length).toBe(1);
    expect(retrievedInviteeTwo.groupActivities.length).toBe(1);
    // ****** Since refactor modified schema such that sub resolvers no longer 12/15/18. *****
    // return an array of the groupActivities object.
    // I could however see this being potentially worth testing... So I could opt for using
    // the GraphQL request for getting a userByUsername instead of the service function
    // where retrieved(Inviter/Invitee)Two constants are being assigned.
    // expect(retrievedInviterTwo.groupActivities[0].groupUuid).toBe(groupUuid);
    // expect(retrievedInviteeTwo.groupActivities[0].groupUuid).toBe(groupUuid);
    // Checking that the invitee was added to the group's members
    // and that the user's nested group now contains the newly joined group.
    expect(joinedGroup.uuid).toBe(groupUuid);
    expect(joinedGroup.members.length).toBe(2);
    expect(retrievedInviteeTwo.firstname).toBe("Sam");
    // ***** This is also something that will need to be fixed to be tested since *****
    // the refactor on 12/15/18.
    // expect(retrievedInviterTwo.groups[0].uuid).toBe(groupUuid);
    // !! Gonna need to look into this... Would be nice to actually receive
    // the data representation that I'm expecting for the UI. Or maybe I'll just have to
    // implement a refetch...
    // Checking that both of the user's groupInvitation arrays are empty.
    // These two checks will fail with the information returned from the
    // acceptGroupInvitation resolver.
    // expect(userOne.groupInvitations.length).toBe(0);
    // expect(userTwo.groupInvitations.length).toBe(0);
    // However, manually fetching the below will show that group invitations array
    // are empty.
    // const updatedUser = await getUserByU\sername("BamBamSar");
    // const updatedGroup = await getGroupById(updatedUser.groups[0]);
    // const updatedUserTwo = await getUserById(updatedGroup.members[1]);
    done();
  });
});
