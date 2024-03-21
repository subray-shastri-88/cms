import { gql } from '@apollo/client';

const loadCPOs = gql`
  query CPOs($pagination: IPagination) {
    cpo: CPOs(filter: { kind: CPO }, pagination: $pagination) {
      docs {
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
        billing {
          gst
          pan
          accountNumber
          ifsc
      }
        phone
        kind
        perUnitAcCharge
        perUnitDcCharge
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
    iso: CPOs(filter: { kind: ISO }, pagination: $pagination) {
      docs {
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
        billing {
          gst
          pan
          accountNumber
          ifsc
      }
        phone
        kind
        perUnitAcCharge
        perUnitDcCharge
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
    all: CPOs(pagination: $pagination) {
      docs {
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
        billing {
          gst
          pan
          accountNumber
          ifsc
      }
        phone
        kind
        perUnitAcCharge
        perUnitDcCharge
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

const loadISOs = gql`
  query CPOs($pagination: IPagination) {
    iso: CPOs(filter: { kind: ISO }, pagination: $pagination) {
      docs {
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
        billing {
          gst
          pan
          accountNumber
          ifsc
      }
        phone
        kind
        perUnitAcCharge
        perUnitDcCharge
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

const loadAllPartners = gql`
  query CPOs($pagination: IPagination) {
    all: CPOs(pagination: $pagination) {
      docs {
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
        billing {
          gst
          pan
          accountNumber
          ifsc
      }
        phone
        kind
        perUnitAcCharge
        perUnitDcCharge
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

const fetchPartners = { loadCPOs, loadISOs, loadAllPartners };
export default fetchPartners;
