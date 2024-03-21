import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { assignVehicle } from '../../../graphQL/corporate';
import { useMutation } from '@apollo/client';
import {
  Box,
  Modal,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Autocomplete
} from '@mui/material';
import Fleet from '../Fleet/getFleet';

const style = {
  position: 'absolute',
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: '3px',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3
};

const AssignVehicle = ({ driverId, open, setOpen, corpId, callBack }) => {
  const [selectedVehicle, setSelectedVehicle] = useState();

  const { fleetList, pagination, handlePagination } = Fleet({
    corpId,
    count: 1000
  });

  const [assignVehicleModel, { data }] = useMutation(assignVehicle, {
    variables: {
      driverId: null,
      vehicleId: null
    }
  });

  const handleSubmit = () => {
    assignVehicleModel({
      variables: {
        driverId: driverId,
        vehicleId: selectedVehicle?.id
      }
    });
  };

  useEffect(() => {
    if (data) {
      callBack(1);
      setOpen(false);
    }
  }, [data]);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box
        sx={{
          ...style,
          width: '800px',
          maxHeight: '400px',
          overflowY: 'scroll'
        }}
      >
        <Card>
          <CardHeader subheader="Edit The Driver Vehicle Details" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={12} xs={12}>
                <Autocomplete
                  fullWidth
                  id="combo-box-demo"
                  options={fleetList}
                  getOptionLabel={(option) => option.registrationNumber}
                  onChange={(event, newValue) => setSelectedVehicle(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Select The Vehicle" />
                  )}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Button
                  key="two"
                  color="primary"
                  variant="contained"
                  sx={{ width: '100%' }}
                  onClick={handleSubmit}
                  disabled={!selectedVehicle}
                >
                  Assign Vehicle
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default AssignVehicle;
