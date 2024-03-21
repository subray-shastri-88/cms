import React, { useState, useEffect } from "react";
import { get } from "lodash";
import {
  Box,
  Button,
  Modal,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Select,
  Checkbox,
  ListItemText,
  MenuItem,
  InputLabel,
  FormControl,
  outlinedInput,
  Autocomplete,
  FormLabel,
  Radio,
  FormControlLabel,
  RadioGroup,
} from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";

import ErrorBox from "../ui/ErrorBox/ErrorBox";
import { emptyValueChecker } from "../../utils/jsUtils";
import { WithCpoCtx } from "../../contexts/cpoContext";
import userApis from "../../graphQL/users";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { getVM, createVehicleModel } from "../../graphQL/vehicle";
import { getPortTypes } from "../../graphQL/machines/plugs";
import Swal from "sweetalert2";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "3px",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const NewVehicle = ({ fetchData }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [vms, setVms] = useState([]);
  const [power, setPower] = useState("");
  const [selectedmake, setMake] = useState();
  const [chargeTypes, setChargeTypes] = useState();
  const [portsApiData, setPortsApiData] = useState([]);
  const [portTypes, setPortTypes] = useState([]);
  const [selectedPorts, setSelectedPorts] = useState([]);

  const { data: PortTypesData } = useQuery(getPortTypes);

  const [createVehicle, { data: createVehicleData, loading, error }] =
    useMutation(createVehicleModel, {
      variables: {
        input: {
          manufacturerId: null,
          maxPower: null,
          name: null,
          powerType: null,
          supportedPorts: null,
          type: null,
        },
      },
    });

  useEffect(() => {
    if (chargeTypes) {
      let filteredPorts = [];
      chargeTypes.forEach((ch) => {
        const prt = portsApiData.filter((port) => port.type === ch);
        filteredPorts.push(...prt);
      });
      setPortTypes(filteredPorts);
    }
  }, [chargeTypes]);

  useEffect(() => {
    setPortsApiData(get(PortTypesData, "PortTypes", []));
  }, [PortTypesData]);

  const filterVmTypes = (data) => {
    const list = data.filter((item) => item.type.includes(type));
    setVms(list);
  };

  const { data, refetch } = useQuery(getVM, {
    filter: {
      query: "",
    },
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onFormSubmit = () => {
    createVehicle({
      variables: {
        input: {
          manufacturerId: selectedmake.id,
          maxPower: Number(power),
          name: name,
          powerType: chargeTypes,
          supportedPorts: selectedPorts.map((item) => item.id),
          type: type,
        },
      },
    });
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "New vehicle successfully added.",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const checkIfValid = () => {
    return (
      name &&
      type &&
      selectedmake &&
      power &&
      selectedPorts &&
      selectedPorts.length > 0 &&
      chargeTypes &&
      chargeTypes.length > 0 &&
      selectedPorts.length >= chargeTypes.length
    );
  };

  const vehiclesType = ["2W", "3W", "LMV", "HMV"];

  useEffect(() => {
    if (type) {
      filterVmTypes(get(data, "VehicleManufacturer", []));
    }
  }, [type, data]);

  const refresh = () => {
    setName();
    setType();
    setPower();
    setSelectedPorts();
    setChargeTypes();
    setMake();
  };
  useEffect(() => {
    if (createVehicleData) {
      setOpen(false);
      refresh();
      fetchData();
    }
  }, [createVehicleData]);

  return (
    <React.Fragment>
      <Button
        color="primary"
        size="small"
        variant="contained"
        onClick={handleOpen}
      >
        New Model
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            ...style,
            width: "900px",
            maxHeight: "900px",
            overflowY: "scroll",
          }}
        >
          <Card>
            <CardHeader title="Add New Vehicle Model" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Model Name"
                    name="name"
                    onChange={(e) => setName(e.target.value)}
                    required
                    value={name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <Autocomplete
                    fullWidth
                    id="combo-box-demo"
                    options={vehiclesType}
                    onChange={(event, newValue) => setType(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Vehicle Type" />
                    )}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    fullWidth
                    id="combo-box-demo"
                    options={vms}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => setMake(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Vehicle Manufacturer"
                      />
                    )}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    fullWidth
                    label="Max I/P Power"
                    name="power"
                    variant="outlined"
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    fullWidth
                    multiple
                    limitTags={2}
                    id="combo-box-demo"
                    options={["AC", "DC"]}
                    onChange={(event, newValue) => setChargeTypes(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Supported Charging Types" />
                    )}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    fullWidth
                    multiple
                    limitTags={2}
                    id="combo-box-demo"
                    options={portTypes}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => setSelectedPorts(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Compatible Ports" />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Button
            color="primary"
            variant="contained"
            sx={{ marginTop: 3, float: "right" }}
            onClick={onFormSubmit}
            disabled={!checkIfValid()}
          >
            Add Vehicle Model
          </Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default WithCpoCtx(NewVehicle);
