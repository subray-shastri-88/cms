import { gql } from '@apollo/client';

const createCPO = gql`
  mutation ($input: ICPO!) {
    saveCPO(input: $input) {
      success
      message
      data
      error
    }
  }
`;

const updateCPO = gql`
  mutation ($cpoId: String!, $input: ICPO!) {
    saveCPO(cpoId: $cpoId, input: $input) {
      success
      message
      data
      error
    }
  }
`;

const autoCompleteCPO = gql`
  query AutocompleteCPO($query: String!) {
    autocompleteCPO(query: $query) {
      id
      name
    }
  }
`;

const getCPOs = gql`
  query ($pagination: IPagination) {
    CPOs(pagination: $pagination) {
      docs {
        id
        name
        revenuePlan
        address {
          line1
          line2
          city
          state
          phone
          zip
        }
        status
      }
      pagination {
        totalDocs
        limit
        page
        totalPages
        hasPrevPage
        hasNextPage
        prevPage
        nextPage
      }
    }
  }
`;

const cpoRequests = { createCPO, autoCompleteCPO, getCPOs, updateCPO };

export default cpoRequests;
