import { gql } from '@apollo/client';

export const getUserWallet = gql`
  query Query($userId: String!) {
    Wallet(userId: $userId) {
        _id
        id
        credit
        reserved
        totalAmount
        transactionIds
        user {
          _id
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
        transactions {
            _id
            type
            amount
            consumedAmount
            reserved
            status
            createdAt
            updatedAt
            kind
        }
    }
  }
`;

export const walletTransaction = gql`
  query Query($pagination: IPagination!, $filter: IWalletFilter!) {
    WalletTransaction(pagination: $pagination, filter: $filter) {
      docs {
        _id
        type
        amount
        consumedAmount
        reserved
        status
        createdAt
        updatedAt
        kind
        reason
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

