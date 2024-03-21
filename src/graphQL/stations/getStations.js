import { gql, useQuery } from '@apollo/client';

const stationsQuery = gql`
  query Query($pagination: IPagination!, $filter: IStationFilter!) {
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
        status
        flag
        images
        chargers {
          id
          templateId
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
            perUnitAcCharge
            perUnitDcCharge
            defaultTariffUnitPrice
          }
          ocppVersion
          machineId
        }
        cpo {
          id
          name
        }
        location
        supportedPorts
        perUnitAcCharge
        perUnitDcCharge
        slotTimeInMin
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

export default stationsQuery;
