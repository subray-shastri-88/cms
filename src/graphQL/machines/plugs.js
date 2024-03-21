import { gql, useQuery } from "@apollo/client";

const addNewPlugType = gql`
  mutation CreatePortType($input: IPortType!) {
    createPortType(input: $input) {
      data
      error
      message
      success
    }
  }
`;

const deletePlugType = gql`
  mutation DeletePortType {
    deletePortType {
      data
      error
      message
      success
    }
  }
`;

const updatePlugType = gql`
  mutation UpdatePortType($input: IPortType!) {
    updatePortType(input: $input) {
      data
      error
      message
      success
    }
  }
`;

const getPortTypes = gql`
  query Query {
    PortTypes {
      id
      name
      supportedPowers
      type
      images
    }
  }
`;

const updatePlug = gql`
  mutation UpdatePlug($input: IPlug! , $stationId: String! , $chargerId: String! , $plugId: String!) {
    updatePlug(input: $input ,stationId: $stationId , chargerId: $chargerId , plugId: $plugId ) {
      data
      error
      message
      success
    }
  }
`;

export {
  addNewPlugType,
  deletePlugType,
  updatePlugType,
  getPortTypes,
  updatePlug,
};
