import { gql } from '@apollo/client';

export const createVehicleManufacturer = gql`
  mutation Mutation($name: String!, $type: [String!]!) {
    createVehicleManufacturer(name: $name, type: $type) {
      success
      message
      data
      error
    }
  }
`;

export const getVM = gql`
  query VehicleManufacturer($filter: IVehicleManufacturerFilter) {
    VehicleManufacturer(filter: $filter) {
      id
      name
      type
    }
  }
`;

export const createVehicleModel = gql`
  mutation CreateVehicleModel($input: IVehicleModel!) {
    createVehicleModel(input: $input) {
      success
      data
      error
      message
    }
  }
`;


export const editVehicleModel = gql`
  mutation EditVehicleModel($input: IVehicleModel!) {
    editVehicleModel(input: $input) {
      success
      data
      error
      message
    }
  }
`;

export const getVehicles = gql`
  query VehicleModels(
    $pagination: IPagination!
    $filter: IVehicleModelFilter!
  ) {
    VehicleModels(pagination: $pagination, filter: $filter) {
      docs {
        id
        type
        name
        manufacturerId
        maxPower
        powerType
        supportedPorts
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
