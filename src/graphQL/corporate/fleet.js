import { gql, useMutation } from '@apollo/client';

const createFleetVehicleApi = gql`
  mutation Mutation($corpId: String!, $input: IFleetVehicle!) {
    createFleetVehicle(corpId: $corpId, input: $input) {
      success
      message
      data
      error
    }
  }
`;

const CreateFleetVehicle = () => {
  const [createFleet, { data: response, loading, error: err }] = useMutation(
    createFleetVehicleApi,
    {
      variables: {
        corpId: '',
        input: {
          registrationNumber: null,
          chassis: null,
          engineNumber: null,
          vinNumber: null,
          modelId: null,
          manufacturerId: null,
          status: null
        }
      }
    }
  );

  const createFleetVehicle = ({
    corpId,
    registrationNumber,
    chassis,
    engineNumber,
    vinNumber,
    modelId,
    manufacturerId
  }) => {
    createFleet({
      variables: {
        corpId,
        input: {
          registrationNumber,
          chassis,
          engineNumber,
          vinNumber,
          modelId,
          manufacturerId,
          status: 'ACTIVE'
        }
      }
    });
  };

  return { response, createFleetVehicle };
};

export { CreateFleetVehicle };
