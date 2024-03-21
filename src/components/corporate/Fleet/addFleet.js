import React, { useState, useEffect } from 'react';
import {
  Box,
  Divider,
  Grid,
  Button,
  CardHeader,
  Card,
  CardContent,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  TableRow,
  Pagination
} from '@mui/material';
import { get } from 'lodash';
import { getVehicles, getVM } from '../../../graphQL/vehicle';
import { CreateFleetVehicle } from '../../../graphQL/corporate/fleet';
import { useQuery, useLazyQuery } from '@apollo/client';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: '3px',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3
};
const AddNewFleet = ({ corpId, fleetType, createFleetVehicle, forceClose }) => {
  const [open, setOpen] = useState(false);
  const [vehicleModels, setVehicleModels] = useState([]);
  const [type, setType] = useState('');
  const [vms, setVms] = useState([]);
  const [selectedMake, setMake] = useState();
  const [selectedModel, setModel] = useState();
  const [partnerData, setPartnerData] = useState({
    chassis: '',
    engine: '',
    vin: '',
    reg: ''
  });

  const filterVmTypes = (data) => {
    const list = data.filter((item) => item.type.includes(fleetType));
    setVms(list);
  };

  const handleChange = (event) => {
    setPartnerData({
      ...partnerData,
      [event.target.name]: event.target.value
    });
  };

  const [getVlist, { data }] = useLazyQuery(getVehicles, {
    variables: {
      pagination: {
        limit: 1000,
        page: 1
      },
      filter: {
        manufacturerId: null,
        type: fleetType
      }
    }
  });

  useEffect(() => {
    if (selectedMake) {
      getVlist({
        variables: {
          pagination: {
            limit: 100,
            page: 1
          },
          filter: {
            manufacturerId: [selectedMake],
            type: fleetType
          }
        }
      });
    }
  }, [selectedMake]);

  const { data: vmData } = useQuery(getVM, {
    filter: {
      query: ''
    }
  });

  useEffect(() => {
    if (data) {
      setVehicleModels(get(data, 'VehicleModels.docs', []));
    }
  }, [data]);

  useEffect(() => {
    const list = get(vmData, 'VehicleManufacturer', []);
    filterVmTypes(list);
  }, [vmData]);

  const handleSubmit = () => {
    createFleetVehicle({
      corpId,
      registrationNumber: partnerData.reg,
      chassis: partnerData.chassis,
      engineNumber: partnerData.engine,
      vinNumber: partnerData.vin,
      modelId: selectedModel,
      manufacturerId: selectedMake
    });
  };

  useEffect(() => {
    if (forceClose) {
      setPartnerData({
        chassis: '',
        engine: '',
        vin: '',
        reg: ''
      });
    }
    setModel();
    setMake();
    setOpen(false);
  }, [forceClose]);

  return (
    <React.Fragment>
      <Button
        color="primary"
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ position: 'absolute', top: '25px', right: 30 }}
      >
        Add Fleet
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            ...style,
            width: '900px',
            maxHeight: '900px',
            overflowY: 'scroll'
          }}
        >
          <Card>
            <CardHeader title="New Vehicle To Fleet" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Chassis"
                    name="chassis"
                    onChange={handleChange}
                    required
                    value={partnerData.chassis}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Engine Number"
                    name="engine"
                    onChange={handleChange}
                    required
                    value={partnerData.engine}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Vin"
                    name="vin"
                    onChange={handleChange}
                    required
                    value={partnerData.vin}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Reg Number"
                    name="reg"
                    onChange={handleChange}
                    required
                    value={partnerData.reg}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card>
            <CardHeader subheader="Select Vehicle Template" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Vehicle Manufacturers
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Vehicle Manufacturers"
                      name="make"
                      onChange={(e) => setMake(e.target.value)}
                    >
                      {vms.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Vehicle Model
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Vehicle Model"
                      name="model"
                      onChange={(e) => setModel(e.target.value)}
                      disabled={vehicleModels.length <= 0}
                    >
                      {vehicleModels.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Divider />
          <Button
            color="primary"
            variant="contained"
            sx={{ marginTop: 3, float: 'right' }}
            disabled={
              !(
                partnerData.chassis &&
                partnerData.engine &&
                partnerData.reg &&
                partnerData.vin &&
                selectedMake &&
                selectedModel
              )
            }
            onClick={handleSubmit}
          >
            Add New Vehicle to Fleet
          </Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default AddNewFleet;
