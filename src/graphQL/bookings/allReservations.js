import { gql } from '@apollo/client';
const allReservations = gql`
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
      pagination {
        totalDocs
      }
    }
    febData: Reservations(pagination: $pagination, filter: $febData) {
      pagination {
        totalDocs
      }
    }
    marchData: Reservations(pagination: $pagination, filter: $marchData) {
      pagination {
        totalDocs
      }
    }

    aprilData: Reservations(pagination: $pagination, filter: $aprilData) {
      pagination {
        totalDocs
      }
    }
    mayData: Reservations(pagination: $pagination, filter: $mayData) {
      pagination {
        totalDocs
      }
    }
    junData: Reservations(pagination: $pagination, filter: $junData) {
      pagination {
        totalDocs
      }
    }
    julData: Reservations(pagination: $pagination, filter: $julData) {
        pagination {
          totalDocs
        }
    }
    augData: Reservations(pagination: $pagination, filter: $augData) {
        pagination {
          totalDocs
        }
    }
    sepData: Reservations(pagination: $pagination, filter: $sepData) {
        pagination {
          totalDocs
        }
    }  
    octData: Reservations(pagination: $pagination, filter: $octData) {
        pagination {
          totalDocs
        }
    }
    novData: Reservations(pagination: $pagination, filter: $novData) {
        pagination {
          totalDocs
        }
    }
    decData: Reservations(pagination: $pagination, filter: $decData) {
        pagination {
          totalDocs
        }
    }
  }
`;

export default allReservations;
