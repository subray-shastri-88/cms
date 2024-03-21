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

export default createCPO;
