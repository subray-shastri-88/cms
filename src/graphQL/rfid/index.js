import { gql, useMutation, useLazyQuery } from '@apollo/client';
import { get } from 'lodash';

const RFIDTagsAPI = gql`
  query RFIDTags($pagination: IPagination!, $filter: IRFIDTagFilter!) {
    RFIDTags(pagination: $pagination, filter: $filter) {
      docs {
        id
        idTag
        cpoId
        corporateId
        userId
        suspended
        cpo {
          name
          id
        }
        corporate {
          name
          id
        }
        user {
          name
          id
          kind
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

const GetRfidTags = () => {
  const [getRfIds, { data, loading, error: err }] = useLazyQuery(RFIDTagsAPI, {
    variables: {
      pagination: {
        limit: null,
        page: null
      },
      filter: {
        corporateId: null,
        cpoId: null
      }
    }
  });

  const getRfidTags = ({ corpId, cpoId, page }) => {
    let filter = {
      cpoId: null
    };
    if (corpId) {
      filter.corporateId = corpId;
    }
    if (cpoId) {
      filter.cpoId = cpoId;
    }
    getRfIds({
      pagination: {
        limit: 10,
        page: page || 1
      },
      filter: filter
    });
  };

  return {
    loading,
    rfidTags: get(data, 'RFIDTags.docs', []),
    pagination: get(data, 'RFIDTags.pagination', []),
    getRfidTags
  };
};

const createRfIdAPI = gql`
  mutation CreateRFIDTag($input: IRFIDTag) {
    createRFIDTag(input: $input) {
      success
      message
      data
      error
    }
  }
`;

const CreateRfId = () => {
  const [create, { data, loading, error: err }] = useMutation(createRfIdAPI, {
    variables: {
      input: {
        cpoId: null,
        idTag: null
      }
    }
  });
  const createRfIds = ({ cpoId, idTag }) => {
    create({
      variables: {
        input: {
          cpoId,
          idTag
        }
      }
    });
  };

  return { createRfIds, createRfIdResponse: data };
};

const linkRFIDToCorporateAPI = gql`
  mutation LinkRFIDToCorporate(
    $linkRfidToCorporateId: String!
    $corporateId: String!
  ) {
    linkRFIDToCorporate(id: $linkRfidToCorporateId, corporateId: $corporateId) {
      success
      message
      data
      error
    }
  }
`;

const LinkRFIDToCorporate = () => {
  const [link, { data, loading, error: err }] = useMutation(
    linkRFIDToCorporateAPI,
    {
      variables: {
        linkRfidToCorporateId: null,
        corporateId: null
      }
    }
  );
  const linkRFIDToCorporate = ({ corporateId, idTag }) => {
    link({
      variables: {
        linkRfidToCorporateId: idTag,
        corporateId: corporateId
      }
    });
  };

  return { linkRFIDToCorporate, linkRFIDToCorporateRes: data };
};

const linkRFIDToUserAPI = gql`
  mutation Mutation($linkRfidToUserId: String!, $userId: String!) {
    linkRFIDToUser(id: $linkRfidToUserId, userId: $userId) {
      success
      message
      data
      error
    }
  }
`;

const LinkRFIDToUser = () => {
  const [link, { data, loading, error: err }] = useMutation(linkRFIDToUserAPI, {
    variables: {
      linkRfidToUserId: null,
      userId: null
    }
  });
  const linkRFIDToUser = ({ userId, idTag }) => {
    link({
      variables: {
        linkRfidToUserId: idTag,
        userId: userId
      }
    });
  };

  return { linkRFIDToUser, linkRFIDToUserRes: data };
};

const ToggleRFIDTagSuspension = gql`
  mutation ToggleRFIDTagSuspension($id: String!, $isSuspended: Boolean!) {
    toggleRFIDTagSuspension(id: $id, isSuspended: $isSuspended) {
      success
      message
      data
      error
    }
  }
`;

export { GetRfidTags, CreateRfId, LinkRFIDToCorporate, LinkRFIDToUser , RFIDTagsAPI , ToggleRFIDTagSuspension};
