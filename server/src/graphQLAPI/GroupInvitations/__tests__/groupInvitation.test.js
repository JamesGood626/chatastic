const request = require("supertest");
const { httpServer } = require("../../../app");
const {
  graphQLQueryRequest,
  graphQLMutationRequest,
  postRequest,
  postRequestWithHeaders,
  dropUserCollection,
  dropGroupCollection,
  dropGroupInvitationCollection,
  createUserGraphQLRequest,
  loginUserGraphQLRequest,
  createGroupGraphQLRequest
} = require("../../testHelpers");
const { getUserByUsername } = require("../../Accounts/services");

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
  username: "BamBamSar",
  password: "supa-secret"
};

const secondUserLoginInput = {
  username: "BamBamSam",
  password: "supa-secret"
};

const group = {
  title: "The Group You Need",
  creationDate: Date.now()
};

const groupInvitation = {
  sentDate: Date.now()
};

const createGroupInvitationMutation = `mutation createGroupInvitationOp($input: CreateGroupInvitationInput!) {
  createGroupInvitation(input: $input) {
    uuid
    group {
      title
    }
    inviter {
      firstname
    }
    invitee {
      firstname
    }
  }
}`;

const createGroupInvitationGraphQLRequest = async (
  createdRequest,
  token,
  groupInvitation
) => {
  const operationInfo = await graphQLMutationRequest(
    groupInvitation,
    createGroupInvitationMutation,
    "createGroupInvitationOp"
  );
  const response = await postRequestWithHeaders(
    createdRequest,
    operationInfo,
    token
  );

  return response;
};

const acceptGroupInvitationMutation = `mutation acceptGroupInvitationOp($input: AcceptGroupInvitationInput!) {
  acceptGroupInvitation(input: $input) {
    acceptedMessage
  }
}`;

const acceptGroupInvitationGraphQLRequest = async (
  createdRequest,
  token,
  acceptGroupInvitationInput
) => {
  const operationInfo = await graphQLMutationRequest(
    acceptGroupInvitationInput,
    acceptGroupInvitationMutation,
    "acceptGroupInvitationOp"
  );
  const response = await postRequestWithHeaders(
    createdRequest,
    operationInfo,
    token
  );

  return response;
};

describe("With the GroupInvitation resource a user may issue a GraphQL request to", () => {
  let createdRequest;
  let server;

  beforeAll(async done => {
    server = await httpServer.listen(1000);
    createdRequest = await request.agent(server);
    await createUserGraphQLRequest(createdRequest, userOne);
    await createUserGraphQLRequest(createdRequest, userTwo);
    done();
  });

  afterEach(async done => {
    await dropGroupCollection();
    await dropGroupInvitationCollection();
    done();
  });

  afterAll(async done => {
    await dropUserCollection();
    await server.close(done);
  });

  // test("get all users", async done => {
  //   await createUserGraphQLRequest(createdRequest);
  //   await createUserGraphQLRequest(createdRequest, userTwo);
  //   const response = await allUsersGraphQLRequest(createdRequest);
  //   expect(response.body.data.allUsers.length).toBe(2);
  //   done();
  // });

  test("create a group invitation sent from userTwo to userOne and have userOne accept invitation", async done => {
    // login userTwo
    const loginUserResponse = await loginUserGraphQLRequest(
      createdRequest,
      userLoginInput
    );
    const { token } = loginUserResponse.body.data.loginUser;
    // userTwo must now create a group.
    const createGroupResponse = await createGroupGraphQLRequest(
      createdRequest,
      token,
      group
    );
    const groupUuid = createGroupResponse.body.data.createGroup.uuid;
    // find userOne by username
    const retrievedUserOne = await getUserByUsername("BamBamSam");
    const userOneUuid = retrievedUserOne.uuid;
    // createGroupInvitation
    groupInvitation.groupUuid = groupUuid;
    groupInvitation.inviteeUuid = userOneUuid;
    const createGroupInvitationResponse = await createGroupInvitationGraphQLRequest(
      createdRequest,
      token,
      groupInvitation
    );
    const {
      uuid,
      group: { title },
      inviter,
      invitee
    } = createGroupInvitationResponse.body.data.createGroupInvitation;
    expect(title).toBe("The Group You Need");
    expect(inviter.firstname).toBe("Sarah");
    expect(invitee.firstname).toBe("Sam");
    // login userOne and accept invitation
    const loginSecondUserResponse = await loginUserGraphQLRequest(
      createdRequest,
      secondUserLoginInput
    );
    const secondToken = loginSecondUserResponse.body.data.loginUser.token;
    const acceptGroupInvitationResponse = await acceptGroupInvitationGraphQLRequest(
      createdRequest,
      secondToken,
      { invitationUuid: uuid }
    );
    const {
      acceptedMessage
    } = acceptGroupInvitationResponse.body.data.acceptGroupInvitation;
    expect(acceptedMessage).toBe("Successfully joined.");
    done();
  });
});
