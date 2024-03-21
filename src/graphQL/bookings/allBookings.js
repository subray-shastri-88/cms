import { gql } from '@apollo/client';
//   reserved, hold, cancelled, completed, running;
const allBookings = gql`
  query Reservations(
    $pagination: IPagination!
    $all: IReservationFilter!
    $reserved: IReservationFilter!
    $hold: IReservationFilter!
    $cancelled: IReservationFilter!
    $completed: IReservationFilter!
    $running: IReservationFilter!
  ) {
    all: Reservations(pagination: $pagination, filter: $all) {
      pagination {
        totalDocs
      }
    }
    hold: Reservations(pagination: $pagination, filter: $hold) {
      pagination {
        totalDocs
      }
    }
    reserved: Reservations(pagination: $pagination, filter: $reserved) {
      pagination {
        totalDocs
      }
    }

    completed: Reservations(pagination: $pagination, filter: $completed) {
      pagination {
        totalDocs
      }
    }
    running: Reservations(pagination: $pagination, filter: $running) {
      pagination {
        totalDocs
      }
    }
    cancelled: Reservations(pagination: $pagination, filter: $cancelled) {
      pagination {
        totalDocs
      }
    }
  }
`;

export default allBookings;
