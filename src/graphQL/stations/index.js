import { gql } from "@apollo/client";

const createStation = gql`
  mutation ($input: ICreateStation!) {
    createStation(input: $input) {
      success
      message
      data
      error
    }
  }
`;

const createCharger = gql`
  mutation CreateCharger($stationId: String!, $input: ICreateCharger!) {
    createCharger(stationId: $stationId, input: $input) {
      success
      message
      data
      error
    }
  }
`;

const updateCharger = gql`
  mutation UpdateCharger($stationId: String!, $chargerId: String!, $input: ICharger!) {
    updateCharger(stationId: $stationId, chargerId: $chargerId , input: $input) {
      success
      message
      data
      error
    }
  }
`;

const getAllStations = gql`
  query ($pagination: IPagination!, $filter: IStationFilter!) {
    Stations(pagination: $pagination, filter: $filter) {
      docs {
        id
        name
        description
        stationType
        address {
          line1
          line2
          city
          state
          zip
          phone
        }
        position {
          type
          coordinates
        }
        amenities {
          name
          value
        }
        status
        perUnitAcCharge
        perUnitDcCharge
        flag
        images
        location

        chargers {
          id
          name
          status
          power
          type
          plugs {
            id
            name
            status
            supportedPort
          }
        }
        cpo {
          id
          name
          revenuePlan
          address {
            line1
            line2
            city
            state
            zip
            phone
          }
          slotTimeInMin
        }
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

const getStation = gql`
  query ($stationId: String!) {
    Station(stationId: $stationId) {
      id
      name
      description
      stationType
      address {
        line1
        line2
        city
        state
        zip
        phone
      }
      position {
        type
        coordinates
      }
      amenities {
        name
        value
      }
      status
      perUnitAcCharge
      perUnitDcCharge
      flag
      images
      location
      chargers {
        id
        name
        status
        power
        type
        plugs {
          id
          name
          status
          supportedPort
        }
      }
      cpo {
        id
        name
        revenuePlan
        address {
          line1
          line2
          city
          state
          zip
          phone
        }
        slotTimeInMin
      }
    }
  }
`;

const updateStation = gql`
  mutation ($input: IStation!, $stationId: String!) {
    updateStation(input: $input, stationId: $stationId) {
      success
      message
      data
      error
    }
  }
`;

const ReservationAnalytics = gql`
  query ReservationAnalytics($filter: IReservationAnalyticsFilter!) {
    ReservationAnalytics(filter: $filter) {
      unBilledAmount
      powerCost
      powerConsumed
      booking
      revenue
      totalStations
      serviceCharges
      totalGst
    }
  }
`;

const requests = {
  createStation,
  getAllStations,
  getStation,
  updateStation,
  createCharger,
  updateCharger,
  ReservationAnalytics,
};

export default requests;
