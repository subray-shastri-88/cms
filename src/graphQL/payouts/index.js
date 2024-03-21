import { gql } from '@apollo/client';

const getPayOuts = gql`
  query Query($filter: IPayoutFilter!, $pagination: IPagination!) {
    Payouts(filter: $filter, pagination: $pagination) {
      docs {
        id
        cpoAmount
        applicationFees
        createdAt
        updatedAt
        status
        eta
        unitsConsumed
        transferTo
        transferId
        transferAmount
        cpo {
          name
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

export { getPayOuts };
