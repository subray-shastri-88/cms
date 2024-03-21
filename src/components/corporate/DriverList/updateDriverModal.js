import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  Box,
  Modal,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField
} from '@mui/material';
import { updateDriver } from '../../../graphQL/corporate';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useMutation } from '@apollo/client';

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

const UpdateDriverModal = ({ driver, callBack, open, setOpen }) => {
  const [newChassis, setNewChassis] = useState();
  const [newModel, setNewModel] = useState();

  const [updateDriverData, { data, loading, error: err }] = useMutation(
    updateDriver,
    {
      variables: {
        driverId: '',
        input: {
          chassis: null,
          model: null,
          status: null
        }
      }
    }
  );

  const handleUpdateDriver = ({ id, chassis, model, status }) => {
    let fields = {};
    if (chassis) {
      fields.chassis = chassis;
    }
    if (model) {
      fields.model = model;
    }
    if (status) {
      const newStatus = status === 'ACTIVE' ? 'IN_ACTIVE' : 'ACTIVE';
      fields.status = newStatus;
    }
    updateDriverData({
      variables: {
        driverId: id,
        input: fields
      }
    });
  };

  useEffect(() => {
    if (data) {
      setOpen(false);
      setNewChassis();
      setNewModel();
      callBack();
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
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Chassis"
                  name="chassis"
                  onChange={(e) => setNewChassis(e.target.value)}
                  required
                  value={newChassis}
                  variant="outlined"
                  defaultValue={driver?.chassis}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Vehicle Model"
                  name="model"
                  onChange={(e) => setNewModel(e.target.value)}
                  required
                  value={newModel}
                  variant="outlined"
                  defaultValue={driver?.model}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Button
                  disabled={!(newChassis || newModel)}
                  onClick={() =>
                    handleUpdateDriver({
                      id: driver.id,
                      chassis: newChassis || driver.chassis,
                      model: newModel || driver.model,
                      status: driver.status
                    })
                  }
                  key="two"
                  color="primary"
                  variant="contained"
                  sx={{ width: '100%' }}
                >
                  Edit
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default UpdateDriverModal;
