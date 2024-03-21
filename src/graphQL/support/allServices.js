import { gql } from '@apollo/client';
const allServices = gql`
  query ServiceRequests(
    $pagination: IPagination!
    $PENDING: IServiceRequestFilter!
    $OPENED: IServiceRequestFilter!
    $ASSIGNED: IServiceRequestFilter!
    $INPROCESS: IServiceRequestFilter!
    $CLOSED: IServiceRequestFilter!
  ) {
    PENDING: serviceRequests(pagination: $pagination, filter: $PENDING) {
      pagination {
        totalDocs
      }
    }
    OPENED: serviceRequests(pagination: $pagination, filter: $OPENED) {
      pagination {
        totalDocs
      }
    }

    ASSIGNED: serviceRequests(pagination: $pagination, filter: $ASSIGNED) {
      pagination {
        totalDocs
      }
    }
    INPROCESS: serviceRequests(pagination: $pagination, filter: $INPROCESS) {
      pagination {
        totalDocs
      }
    }
    CLOSED: serviceRequests(pagination: $pagination, filter: $CLOSED) {
      pagination {
        totalDocs
      }
    }
  }
`;

export default allServices;
