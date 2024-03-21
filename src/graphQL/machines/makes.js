import { gql } from '@apollo/client';

const addNewMachineMaker = gql`
  mutation CreateMake($name: String!) {
    createMake(name: $name) {
      success
      message
      data
      error
    }
  }
`;

const getMachineMakers = gql`
  query Query {
    Makes {
      id
      name
    }
  }
`;

const createMachine = gql`
  mutation Mutation($cpoId: String!, $input: IMachine!) {
    createMachine(cpoId: $cpoId, input: $input) {
      data
      error
      message
      success
    }
  }
`;

const getMachines = gql`
  query Machines($filter: IMachineFilter!, $pagination: IPagination!) {
    Machines(pagination: $pagination, filter: $filter) {
      docs {
        id
        name
        status
        charger {
          id
          name
          status
          power
          type
          plugs {
            id
            name
            status
            power
            supportedPort
            supportedPorts
            images
          }
          ocppVersion
          machineId
          supportedPorts
        }
        make {
          id
          name
        }
        cpo {
          name
          id
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

export { addNewMachineMaker, getMachineMakers, createMachine, getMachines };
