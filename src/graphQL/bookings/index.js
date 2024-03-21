import { gql } from '@apollo/client';

const getBookings = gql`
  query Reservations($pagination: IPagination!, $filter: IReservationFilter!) {
    Reservations(pagination: $pagination, filter: $filter) {
      docs {
        id
        createdAt
        startTime
        endTime
        slotDuration
        holdExpiry
        status
        plugType
        chargeType
        powerRating
        pricePerUnit
        reserveAmountSource
        chargingStartTime
        chargingEndTime
        duration
        user {
          id
          name
          email
          phone
        }
        cpo {
          name
          id
        }
        station {
          name
          id
        }
        charger {
          id
          name
          power
          ocppVersion
        }
        plug {
          id
          name
          status
          power
          supportedPort
        }
        initialsoc
        finalsoc
        reservedAmount
        meterAtStart
        meterAtEnd
        unitsConsumed
        totalPowerCharge
        totalServiceCharge
        totalGST
        amount
        refundAmount
        type
        settlement
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

export default getBookings;
