import { gql, useQuery } from '@apollo/client';

export const Support = gql`
query ServiceRequests($pagination: IPagination!, $filter: IServiceRequestFilter!) {
    serviceRequests(pagination: $pagination, filter: $filter) {
        docs {
            id
            name
            email
            phone
            request_type
            reason
            description
            status
            assignedTo
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
                isExists
            }
            updatedAt
            createdAt
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

export const updateService = gql`
  mutation ($reqId: String!, $update: IUpdateRequest!) {
    updateServiceRequest(reqId: $reqId, update: $update) {
      success
      message
      data
      error
    }
  }
`;