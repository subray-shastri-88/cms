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
  InputAdornment,
  Autocomplete,
  IconButton,
} from "@mui/material";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import EvStationIcon from "@mui/icons-material/EvStation";
import NewManufacturer from "./manufacturer";
import {
  getMachineMakers,
  createMachine,
} from "../../../graphQL/machines/makes";
import { getPortTypes } from "../../../graphQL/machines/plugs";
import { useQuery, useMutation } from "@apollo/client";
import { WithCpoCtx } from "../../../contexts/cpoContext";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  overflow: "scroll",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "3px",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const plugSchema = {
  id: "",
  supportedPort: "",
  portPower: "",
  supportedPowers: [],
};

const chargerSchema = {
  name: "",
  power: "",
  type: "",
  ocppVersion: "",
};

const UpdateMachine = ({
  addCharger,
  disabled,
  allPartners,
  fetchMachines,
  selectedMachine,
}) => {
  const [makes, setMakes] = useState([]);
  const [cpo, setCpo] = useState(
    selectedMachine ? selectedMachine.cpo || "" : ""
  );
  const [selectedMake, setSelectedMake] = useState(
    selectedMachine ? selectedMachine.make.id || "" : ""
  );
  const [portTypes, setPortTypes] = useState([]);
  const [name, setName] = useState(
    selectedMachine ? selectedMachine.name || "" : ""
  );
  const [open, setOpen] = useState(false);
  const [charger, setCharger] = useState(
    selectedMachine
      ? {
          name: selectedMachine.charger.name || "",
          power: selectedMachine.charger.power || "",
          type: selectedMachine.charger.type || "",
          ocppVersion: selectedMachine.charger.ocppVersion || "",
        }
      : chargerSchema
  );
  const [chargerPlugs, setChargerPlugs] = useState(
    selectedMachine
      ? selectedMachine.charger.plugs || [{ ...plugSchema }, { ...plugSchema }]
      : [{ ...plugSchema }, { ...plugSchema }]
  );

  const handleCpoChange = (value) => {
    setCpo(value);
  };

  const { data: machineMakes, refetch } = useQuery(getMachineMakers);

  const { data: PortTypesData } = useQuery(getPortTypes);

  useEffect(() => {
    setPortTypes(get(PortTypesData, "PortTypes", []));
  }, [PortTypesData]);

  useEffect(() => {
    if (machineMakes) {
      setMakes(get(machineMakes, "Makes", []));
    }
  }, [machineMakes]);

  useEffect(() => {
    refetch();
  }, [open]);

  const handleChange = (event) => {
    if (event.target.name === "type") {
      setChargerPlugs([{ ...plugSchema }, { ...plugSchema }]);
    }
    setCharger({
      ...charger,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    // Populate the form fields with selectedMachine data when it changes
    if (selectedMachine) {
      setCpo(selectedMachine.cpo || "");
      setSelectedMake(selectedMachine.make.id || "");
      setName(selectedMachine.name || "");
      setCharger({
        name: selectedMachine.charger.name || "",
        power: selectedMachine.charger.power || "",
        type: selectedMachine.charger.type || "",
        ocppVersion: selectedMachine.charger.ocppVersion || "",
      });
      setChargerPlugs(
        selectedMachine.charger.plugs ||
          [{ ...plugSchema }, { ...plugSchema }]
      );
    } else {
      // If selectedMachine is null (initial state), reset the form fields
      setCpo("");
      setSelectedMake("");
      setName("");
      setCharger({ ...chargerSchema });
      setChargerPlugs([{ ...plugSchema }, { ...plugSchema }]);
    }
  }, [selectedMachine]);

  const handlePlugsChange = (index, event, data, type) => {
    const plugs = [...chargerPlugs];
    let selectedPortType;
    if (type === "power") {
      selectedPortType = data;
    } else {
      selectedPortType = portTypes.find(
        (item) => item.id === event.target.value
      );
    }
    const selectedPlug = {
      ...plugs[index],
      [event.target.name]: event.target.value,
      supportedPowers: selectedPortType.supportedPowers,
    };
    plugs[index] = selectedPlug;
    setChargerPlugs([...plugs]);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const removePlug = (index) => {
    if (index > -1) {
      const plugs = [...chargerPlugs];
      plugs.splice(index, 1);
      setChargerPlugs(plugs);
    }
  };

  const addPlugHandler = () => {
    const plugs = [...chargerPlugs, plugSchema];
    setChargerPlugs(plugs);
  };

  const checkIfDataValid = () => {
    const isPlugsValid = chargerPlugs.every(
      (item) => item.portPower && item.supportedPort
    );
    const restData =
      cpo &&
      cpo.id &&
      selectedMake &&
      charger.name &&
      charger.ocppVersion &&
      charger.type &&
      charger.power;
    return isPlugsValid && restData;
  };

  const [createNewMachineTemplate, { data: createNewMachineTemplateData }] =
    useMutation(createMachine, {
      variables: {
        cpoId: "",
        input: {
          charger: {
            name: null,
            plugs: [
              {
                name: null,
                supportedPort: null,
                power: null,
                status: null,
              },
            ],

            power: null,
            type: null,
            ocppVersion: null,
            status: null,
          },
          makeId: null,
          name: null,
        },
      },
    });

  const onChargerSubmit = () => {
    createNewMachineTemplate({
      variables: {
        cpoId: cpo.id,
        input: {
          charger: {
            name: charger.name,
            plugs: chargerPlugs.map((plg, index) => ({
              name: `${index + 1}`,
              supportedPort: plg.supportedPort,
              power: Number(plg.portPower),
              status: "ACTIVE",
            })),
            status: "ACTIVE",
            power: Number(charger.power),
            type: charger.type,
            ocppVersion: charger.ocppVersion,
          },
          makeId: selectedMake,
          name: charger.name,
        },
      },
    });
  };

  useEffect(() => {
    setOpen(false);
    fetchMachines();
  }, [createNewMachineTemplateData]);

  return (
    <React.Fragment>
      <IconButton
        onClick={() => setOpen(true)}
        aria-label="Edit New Machine"
        size="small"
      >
        <ModeEditIcon fontSize="inherit" aria-label="Edit" />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: "80%", height: "100%" }}>
          <Card>
            <CardHeader
              subheader="Update the machine details"
              title={`Edit Machine details`}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Machine Make
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Machine Make"
                      onChange={(e) => setSelectedMake(e.target.value)}
                      value={selectedMake}
                    >
                      {makes.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    onChange={handleChange}
                    required
                    value={charger.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <Autocomplete
                    fullWidth
                    disablePortal
                    id="combo-box-demo"
                    options={allPartners}
                    value={cpo}
                    onChange={(event, newValue) => handleCpoChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Partner"
                        variant="outlined"
                      />
                    )}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={2} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      OCPP Version
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="OCPP Version"
                      name="ocppVersion"
                      onChange={handleChange}
                      value={charger.ocppVersion}
                    >
                      <MenuItem value={"V_1_6"}>1.6</MenuItem>
                      <MenuItem value={"V_2"} disabled>
                        2
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    fullWidth
                    label="Power"
                    name="power"
                    onChange={handleChange}
                    required
                    value={charger.power}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <React.Fragment>
                          <InputAdornment position="end">KW</InputAdornment>
                        </React.Fragment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Charger Type (AC/DC)
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Charging Type (AC/DC)"
                      name="type"
                      onChange={handleChange}
                      value={charger.type}
                    >
                      <MenuItem value={"AC"}>AC</MenuItem>
                      <MenuItem value={"DC"}>DC</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid
                  md={12}
                  xs={12}
                  sx={{
                    marginTop: 5,
                    position: "relative",
                    minHeight: "60px",
                  }}
                >
                  <Grid
                    md={12}
                    xs={12}
                    sx={{
                      maxHeight: "400px",
                      overflowY: "scroll",
                    }}
                  >
                    <Button
                      color="primary"
                      variant="contained"
                      sx={{
                        marginTop: 3,
                        marginRight: 9,
                        float: "right",
                        position: "absolute",
                        top: "0",
                        right: "0",
                        zIndex: "10",
                      }}
                      onClick={addPlugHandler}
                    >
                      Plug +
                    </Button>
                    {chargerPlugs.map((plug, index) => (
                      <React.Fragment key={`Plug-${index}`}>
                        <Grid
                          container
                          spacing={3}
                          sx={{
                            marginTop: 3,
                            padding: 5,
                          }}
                        >
                          <Grid item md={2} xs={12}>
                            <h3>{`Plug ${index + 1}`}</h3>
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                Port Type
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Plug-Type"
                                name="supportedPort"
                                onChange={(e) =>
                                  handlePlugsChange(index, e, plug, "port")
                                }
                                value={plug.supportedPort}
                                disabled={!charger.type}
                              >
                                {portTypes.map((port, index) => (
                                  <MenuItem
                                    key={`${port.id}-${index}`}
                                    value={port.id}
                                    disabled={charger.type !== port.type}
                                  >
                                    {port.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                Power OutPut
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label=" Power OutPut"
                                name="portPower"
                                disabled={!plug.supportedPort}
                                onChange={(e) =>
                                  handlePlugsChange(index, e, plug, "power")
                                }
                              >
                                {plug.supportedPowers.map((item, index) => (
                                  <MenuItem value={item} key={index}>
                                    {item} KW
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item md={2} xs={12}>
                            <Button
                              color="error"
                              onClick={() => removePlug(index)}
                            >
                              remove plug
                            </Button>
                          </Grid>
                        </Grid>
                      </React.Fragment>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Divider />
          <Button
            color="primary"
            variant="contained"
            sx={{ marginTop: 3, float: "right" }}
            onClick={onChargerSubmit}
            disabled={!checkIfDataValid()}
          >
            Update Machine
          </Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default WithCpoCtx(UpdateMachine);
