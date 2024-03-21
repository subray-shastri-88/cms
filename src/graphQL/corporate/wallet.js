import { gql, useMutation } from '@apollo/client';

const TransferToDriverWalletAPI = gql`
  mutation TransferToDriverWallet(
    $corpId: String!
    $driverId: String!
    $amount: Int!
    $currentUserId: String!
  ) {
    transferToDriverWallet(
      corpId: $corpId
      driverId: $driverId
      amount: $amount
      currentUserId: $currentUserId
    ) {
      success
      message
      data
      error
    }
  }
`;

const TransferToDriverWallet = () => {
  const [transfer, { data: driverToWalletResponse, loading, error: err }] =
    useMutation(TransferToDriverWalletAPI, {
      variables: {
        corpId: '',
        driverId: '',
        amount: '',
        currentUserId: ''
      }
    });

  const transferToDriverWallet = ({
    corpId,
    driverId,
    amount,
    currentUserId
  }) => {
    transfer({
      variables: {
        corpId,
        driverId,
        amount,
        currentUserId
      }
    });
  };

  return { driverToWalletResponse, transferToDriverWallet };
};

const RetrieveFromDriverWalletAPI = gql`
  mutation RetrieveFromDriverWallet(
    $corpId: String!
    $driverId: String!
    $amount: Int!
    $currentUserId: String!
  ) {
    retrieveFromDriverWallet(
      corpId: $corpId
      driverId: $driverId
      amount: $amount
      currentUserId: $currentUserId
    ) {
      success
      message
      data
      error
    }
  }
`;

const RetrieveFromDriverWallet = () => {
  const [retrieve, { data: retrieveFromDriverResponse, loading, error: err }] =
    useMutation(RetrieveFromDriverWalletAPI, {
      variables: {
        corpId: '',
        driverId: '',
        amount: '',
        currentUserId: ''
      }
    });

  const retrieveFromDriverWallet = ({
    corpId,
    driverId,
    amount,
    currentUserId
  }) => {
    retrieve({
      variables: {
        corpId,
        driverId,
        amount,
        currentUserId
      }
    });
  };

  return { retrieveFromDriverWallet, retrieveFromDriverResponse };
};

const topUpCorporateWalletAPI = gql`
  mutation TopUpCorporateWallet(
    $corpId: String!
    $userId: String!
    $amount: Int!
  ) {
    topUpCorporateWallet(corpId: $corpId, userId: $userId, amount: $amount) {
      success
      message
      data
      error
    }
  }
`;

const TopUpCorporateWallet = () => {
  const [topUp, { data: topUpCorporateWalletResponse, loading, error: err }] =
    useMutation(topUpCorporateWalletAPI, {
      variables: {
        corpId: null,
        userId: null,
        amount: null
      }
    });

  const topUpCorporateWallet = ({ corpId, amount, userId }) => {
    topUp({
      variables: {
        corpId,
        amount,
        userId
      }
    });
  };

  return { topUpCorporateWalletResponse, topUpCorporateWallet };
};

const addMoneyToCorporateWalletAPI = gql`
  mutation Mutation(
    $corpId: String!
    $currentUserId: String!
    $input: IAddMonkeyToCorporateAccount!
  ) {
    addMoneyToCorporateWallet(
      corpId: $corpId
      currentUserId: $currentUserId
      input: $input
    ) {
      success
      message
      data
      error
    }
  }
`;

const AddMoneyToCorporateWallet = () => {
  const [addMoney, { data: addMoneyToCorporateWalletResponse }] = useMutation(
    topUpCorporateWalletAPI,
    {
      variables: {
        corpId: null,
        currentUserId: null,
        input: {
          amount: null,
          orderId: null,
          paymentId: null
        }
      }
    }
  );

  const addMoneyToCorporateWallet = ({
    corpId,
    amount,
    currentUserId,
    orderId,
    paymentId
  }) => {
    addMoney({
      variables: {
        corpId,
        currentUserId,
        input: {
          amount,
          orderId,
          paymentId
        }
      }
    });
  };

  return { addMoneyToCorporateWalletResponse, addMoneyToCorporateWallet };
};

export {
  TransferToDriverWallet,
  RetrieveFromDriverWallet,
  TopUpCorporateWallet,
  AddMoneyToCorporateWallet
};
