import { gql } from '@apollo/client';

const addNewTariff = gql`
  mutation Mutation($cpoId: String!, $input: ITariff!) {
    createTariff(cpoId: $cpoId, input: $input) {
      data
      error
      message
      success
    }
  }
`;

const getTariff = gql`
  query Query($filter: ITariffFilter!) {
    Tariffs(filter: $filter) {
      id
      name
      isDefault
      ports {
        portType
        config {
          powerType
          powerRating
          pricePerUnit
        }
      }
      startDate
      endDate
    }
  }
`;

const updateTariff = gql`
  mutation UpdateTariff($cpoId: String!, $tariffId: String!, $input: ITariff!) {
    updateTariff(cpoId: $cpoId, tariffId: $tariffId, input: $input) {
      data
      error
      message
      success
    }
  }
`;

export { addNewTariff, getTariff, updateTariff };
