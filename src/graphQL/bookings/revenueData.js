import { gql } from '@apollo/client';
const revenueData = gql`
  query Reservations(
    $pagination: IPagination!
    $janData: IReservationFilter!
    $febData: IReservationFilter!
    $marchData: IReservationFilter!
    $aprilData: IReservationFilter!
    $mayData: IReservationFilter!
    $junData: IReservationFilter!
    $julData: IReservationFilter!
    $augData: IReservationFilter!
    $sepData: IReservationFilter!
    $octData: IReservationFilter!
    $novData: IReservationFilter!
    $decData: IReservationFilter!
  ) {
    janData: Reservations(pagination: $pagination, filter: $janData) {
        docs {
            amount
            unitsConsumed
        }
    }
    febData: Reservations(pagination: $pagination, filter: $febData) {
        docs {
            amount
            unitsConsumed
        }
    }
    marchData: Reservations(pagination: $pagination, filter: $marchData) {
        docs {
            amount
            unitsConsumed
        }
    }

    aprilData: Reservations(pagination: $pagination, filter: $aprilData) {
        docs {
            amount
            unitsConsumed
        }
    }
    mayData: Reservations(pagination: $pagination, filter: $mayData) {
        docs {
            amount
            unitsConsumed
        }
    }
    junData: Reservations(pagination: $pagination, filter: $junData) {
        docs {
            amount
            unitsConsumed
        }
    }
    julData: Reservations(pagination: $pagination, filter: $julData) {
        docs {
            amount
            unitsConsumed
        }
    }
    augData: Reservations(pagination: $pagination, filter: $augData) {
        docs {
            amount
            unitsConsumed
        }
    }
    sepData: Reservations(pagination: $pagination, filter: $sepData) {
        docs {
            amount
            unitsConsumed
        }
    }  
    octData: Reservations(pagination: $pagination, filter: $octData) {
        docs {
            amount
            unitsConsumed
        }
    }
    novData: Reservations(pagination: $pagination, filter: $novData) {
        docs {
            amount
            unitsConsumed
        }
    }
    decData: Reservations(pagination: $pagination, filter: $decData) {
        docs {
            amount
            unitsConsumed
        }
    }
  }
`;

export default revenueData;
