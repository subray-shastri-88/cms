import { gql } from '@apollo/client';

const getUsers = gql`
  query Users($pagination: IPagination!, $filter: IUserFilter!) {
    Users(pagination: $pagination, filter: $filter) {
      docs {
        _id
        id
        name
        role
        email
        phone
        status
        kind
        resourceId
        wallet {
          _id
          credit
          reserved
          totalAmount
        }
        preference {
          plug
          vehicleMakeId
          vehicleModelId
          vehicleType
          stationIds
        }
      }
      pagination {
        totalDocs
        limit
        hasPrevPage
        hasNextPage
        page
        totalPages
        prevPage
        nextPage
      }
    }
  }
`;

const createUsers = gql`
  mutation CreateUser($input: ICreateUser!) {
    createUser(input: $input) {
      success
      message
      data
      error
    }
  }
`;

const createRFID = gql`
  mutation Mutation($input: IRFIDTag) {
    createRFIDTag(input: $input) {
      success
      message
      data
      error
    }
  }
`;

const getUser = gql`
  query Query($userId: String!) {
    User(userId: $userId) {
      _id
      id
      name
      role
      email
      phone
      status
      kind
      resourceId
    }
  }
`;

const getRfids = gql`
  query RFIDTags($pagination: IPagination!, $filter: IRFIDTagFilter!) {
    RFIDTags(pagination: $pagination, filter: $filter) {
      docs {
        id
        idTag
        cpoId
        corporateId
        driverId
        userId
        suspended
      }
      pagination {
        totalDocs
        limit
        hasPrevPage
        hasNextPage
        page
        totalPages
        prevPage
        nextPage
      }
    }
  }
`;

const loginUser = gql`
  mutation Mutation($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      success
      message
      data {
        token
        user {
          id
          name
          role
          email
          phone
          status
          kind
          resourceId
          isExists
          isDeleted
        }
      }
      error
    }
  }
`;

const ToggleUserStatus = gql`
  mutation ToggleUserStatus($userId: String!, $status: UserStatus!) {
    toggleUserStatus(userId: $userId, status: $status) {
      success
      message
      data
      error
    }
  }
`;

const deleteUser = gql`
  mutation DeleteUser($input: IDeleteUser!) {
    DeleteUser(input: $input) {
      success
      message
      error
    }
  }
`;

const ForgetPassword = gql`
  mutation ForgetPassword($username: String!) {
    forgetPassword(username: $username) {
      success
      message
      error
      data {
          id
          resetToken
      }
    }
  }
`;

const VerifyLoginOTP = gql`
  mutation VerifyLoginOTP($id: String! , $otp: String!) {
    verifyLoginOTP(id: $id , otp: $otp) {
      success
      message
      error
      data {
          id
          resetToken
      }
    }
  }
`;

const ResetPassword = gql`
  mutation ResetPassword($id: String! , $token: String! , $password: String! ) {
    resetPassword(id: $id , token: $token , password: $password) {
      success
      message
      error
    }
  }
`;

const userApis = {
  createUsers,
  getUsers,
  createRFID,
  getUser,
  getRfids,
  loginUser,
  ToggleUserStatus,
  deleteUser,
  ForgetPassword,
  VerifyLoginOTP,
  ResetPassword
};

export default userApis;
