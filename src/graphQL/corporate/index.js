import { gql } from '@apollo/client';

const saveCorporate = gql`
  mutation ($input: ICorporate!) {
    saveCorporate(input: $input) {
      success
      message
      data
      error
    }
  }
`;

const updateCorporate = gql`
  mutation ($input: ICorporate! , $corporateId: String!) {
    saveCorporate(input: $input , corporateId: $corporateId) {
      success
      message
      data
      error
    }
  }
`;

const getCorporate = gql`
  query Corporate($corporateId: String!) {
    Corporate(corporateId: $corporateId) {
      id
      name
      businessType
      address {
        line1
        line2
        city
        state
        zip
        phone
      }
      registrationNumber
      gst
      contractStartDate
      contractEndDate
      fleetType
      email
      phone
      status
      wallet {
        id
        credit
        reserved
      }
    }
  }
`;

const getDriverList = gql`
  query Query($pagination: IPagination!, $filter: IDriverFilter!) {
    Drivers(pagination: $pagination, filter: $filter) {
      docs {
        id
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
          wallet {
            credit
            id
            reserved
          }
        }
        vehicle {
          id
          registrationNumber
          chassis
          engineNumber
          vinNumber
          model {
            id
            type
            name
            manufacturerId
            maxPower
            powerType
            supportedPorts
          }
          manufacturer {
            id
            name
            type
          }
          status
        }
        status
        corporate {
          id
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

const updateDriver = gql`
  mutation UpdateDriver($driverId: String!, $input: IDriver!) {
    updateDriver(driverId: $driverId, input: $input) {
      success
      message
      data
      error
    }
  }
`;

const getDriverDetails = gql`
  query Driver($driverId: String!) {
    Driver(driverId: $driverId) {
      id
      user {
        _id
        id
        name
        role
        email
        phone
        status
        wallet {
          id
          credit
          reserved
        }
        kind
        resourceId
      }
      vehicle {
        id
        registrationNumber
        chassis
        engineNumber
        vinNumber
        model {
          id
          type
          name
          manufacturerId
          maxPower
          powerType
          supportedPorts
        }
        manufacturer {
          id
          name
          type
        }
        status
      }
      status
      corporate {
        name
        id
      }
    }
  }
`;

const createDriver = gql`
  mutation CreateDriver($corporateId: String!, $input: ICreateDriver!) {
    createDriver(corporateId: $corporateId, input: $input) {
      success
      message
      data
      error
    }
  }
`;

const corporatesList = gql`
  query Query($pagination: IPagination) {
    Corporates(pagination: $pagination) {
      docs {
        id
        name
        businessType
        address {
          line1
          line2
          city
          state
          zip
          phone
        }
        registrationNumber
        gst
        contractStartDate
        contractEndDate
        fleetType
        email
        phone
        status
        wallet {
          id
          credit
          reserved
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

const getFleetVehicles = gql`
  query FleetVehicles(
    $filter: IFleetVehicleFilter!
    $pagination: IPagination!
  ) {
    FleetVehicles(filter: $filter, pagination: $pagination) {
      docs {
        id
        registrationNumber
        chassis
        engineNumber
        vinNumber
        model {
          id
          type
          name
          manufacturerId
          maxPower
          powerType
          supportedPorts
        }
        manufacturer {
          id
          name
          type
        }
        status
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

const assignVehicle = gql`
  mutation AssignVehicleToDriver($driverId: String!, $vehicleId: String!) {
    assignVehicleToDriver(driverId: $driverId, vehicleId: $vehicleId) {
      success
      message
      data
      error
    }
  }
`;

export {
  saveCorporate,
  getCorporate,
  getDriverList,
  updateDriver,
  getDriverDetails,
  createDriver,
  corporatesList,
  getFleetVehicles,
  assignVehicle,
  updateCorporate
};
