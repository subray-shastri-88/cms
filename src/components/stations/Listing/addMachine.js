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
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import stationRequest from "../../../graphQL/stations";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { getMachineMakers, getMachines } from "../../../graphQL/machines/makes";
import { getTariff } from "../../../graphQL/tariff";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Swal from "sweetalert2";

const style = {
  bgcolor: "background.paper",
  borderRadius: "3px",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const NewMachine = ({ stationId, setOpen, page, fetchData, cpoId, initialData = {} }) => {
  const [customId, setCustomId] = useState(initialData.customId || "");
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [defaultTariffs, setDefaultTariffs] = useState([]);
  const [specialTariffs, setSpecialTariffs] = useState([]);
  const [selectedDefaultTariff, setSelectedDefaultTariff] = useState("");
  const [selectedSpecialTariff, setSelectedSpecialTariff] = useState("");
  const [isActive, setIsActive] = useState(true);

  const { data: machineMakes, refetch } = useQuery(getMachineMakers);
  // const customId = initialData.customId || ""; 


  const [getMachineTemplates] = useLazyQuery(getMachines, {
    onCompleted: (data) => setTemplates(get(data, "Machines.docs", [])),
  });

  const [getDefaultTariffList] = useLazyQuery(getTariff, {
    onCompleted: (data) => setDefaultTariffs(get(data, "Tariffs", [])),
  });

  const [getSpecialTariffList] = useLazyQuery(getTariff, {
    onCompleted: (data) => setSpecialTariffs(get(data, "Tariffs", [])),
  });

  const onChangeTemplate = (value) => {
    const tmp = templates.find((item) => item.id === value);
    setSelectedTemplate(tmp);
  };

  const onChangeTariff = (value, type) => {
    if (type === "default") {
      const tmp = defaultTariffs.find((item) => item.name === value);
      setSelectedDefaultTariff(tmp);
    } else {
      const tmp = specialTariffs.find((item) => item.name === value);
      setSelectedSpecialTariff(tmp);
    }
  };

  const getTariffPrice = (plug, power, tariffs) => {
    let price = "";
    const portTypeMatch = tariffs.find((item) => item.portType === plug) || "";

    if (portTypeMatch) {
      const powerTypeMatch =
        portTypeMatch.config.find((item) => item.powerRating === power) || "--";
      if (powerTypeMatch) {
        price = powerTypeMatch?.pricePerUnit || "";
      }
    }

    return price;
  };

  useEffect(() => {
    if (selectedTemplate) {
      getDefaultTariffList({
        variables: {
          filter: {
            cpoId: cpoId,
            isDefault: true,
          },
        },
      });
      getSpecialTariffList({
        variables: {
          filter: {
            cpoId: cpoId,
            isDefault: false,
          },
        },
      });
    }
  }, [selectedTemplate]);

  useEffect(() => {
    if (machineMakes) {
      setMakes(get(machineMakes, "Makes", []));
    }
  }, [machineMakes]);

  useEffect(() => {
    if (selectedMake) {
      getMachineTemplates({
        variables: {
          filter: {
            makeId: selectedMake,
            cpoId: cpoId,
          },
          pagination: { page: 1, limit: 10000 }
        },
      });
    }
  }, [selectedMake, getMachineTemplates]);

  const { createCharger } = stationRequest;

  const [createNewCharger, { data: newChargerData, loading: loading, error }] =
    useMutation(createCharger, {
      variables: {
        input: {
          name: "",
          status: "",
          power: "",
          type: "",
          plugs: [
            {
              name: "",
              status: "",
              supportedPorts: [""],
              images: ""
            },
            {
              name: "",
              status: "",
              supportedPorts: [""],
              images: ""
            },
          ],
        },
      },
    });

  const handleClose = () => {
    setOpen(false);
  };

  const addCharger = () => {
    const charger = {
      name: selectedTemplate.name,
      templateId: selectedTemplate.id,
      status: "ACTIVE",
      power: Number(selectedTemplate.charger.power),
      type: selectedTemplate.charger.type,
      ocppVersion: selectedTemplate.charger.ocppVersion,
      plugs: selectedTemplate.charger.plugs.map((item) => ({
        name: item.name,
        status: "ACTIVE",
        supportedPort: item.supportedPort,
        defaultTariffId: selectedDefaultTariff.id,
        specialTariffIds: [selectedSpecialTariff.id],
        power: item.power,
        images: item.images
      })),
    };

    if (customId) {
      charger["id"] = customId;
    }

    createNewCharger({
      variables: {
        stationId: stationId,
        input: {
          ...charger,
        },
      },
    });
  };

  const onChargerSubmit = () => {
    addCharger();
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "New charger successfully added.",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  useEffect(() => {
    if (newChargerData) {
      if (!loading && !error) {
        fetchData(page);
      }
      handleClose();
    }
  }, [newChargerData, loading, error]);

  const OCPP = {
    V_1_6: "1.6",
    V_2_0: "2.0",
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let stamp = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + " " + stamp;
    return strTime;
  };
  const getDate = (item) => {
    if (!item) {
      return "--";
    }
    const date = new Date(item * 1);
    return (
      date.getDate() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getFullYear() +
      " - " +
      formatTime(date)
    );
  };

  const checkIfAllDataValid = () => {
    return selectedDefaultTariff && selectedTemplate;
  };

  
  useEffect(() => {
    if (initialData.selectedTemplateId) {
     
    }
  }, [initialData.selectedTemplateId]);

  useEffect(() => {
    if (initialData.selectedMake) {
      setSelectedMake(initialData.selectedMake);
    
    }
  }, [initialData.selectedMake]);

  useEffect(() => {
    if (initialData.selectedDefaultTariff) {
      setSelectedDefaultTariff(initialData.selectedDefaultTariff);
    }
    if (initialData.selectedSpecialTariff) {
      setSelectedSpecialTariff(initialData.selectedSpecialTariff);
    }
  }, [initialData.selectedDefaultTariff, initialData.selectedSpecialTariff]);

  useEffect(() => {
    if (initialData.selectedTemplateId) {
      setSelectedTemplate(initialData.selectedTemplateId);
    }

    if (initialData.selectedMake) {
      setSelectedMake(initialData.selectedMake);
    }

    if (initialData.selectedDefaultTariff) {
      setSelectedDefaultTariff(initialData.selectedDefaultTariff);
    }

    if (initialData.selectedSpecialTariff) {
      setSelectedSpecialTariff(initialData.selectedSpecialTariff);
    }

    if (initialData.customId) {
      setCustomId(initialData.customId);
    }

    if (initialData.selectedTemplateId) {
      // Fetch additional data based on selected template if needed
      const template = templates.find(item => item.id === initialData.selectedTemplateId);
      if (template) {
        onChangeTemplate(template.id);
      }
    }
  }, [initialData]);


  return (
    <Card sx={style}>
      <CardContent sx={{ border: "0px", padding: "0px" }}>
        {!newChargerData && (
          <React.Fragment>
            <Card>
              <CardHeader
                subheader="Edit the Machine Details"
                title={`Edit Machine`}
              />
              <CardContent>
                <Grid container spacing={3} sx={{ marginBottom: "60px" }}>
                  <Grid item md={12} xs={12} sx={{ marginBottom: "10px" }}>
                    <Divider> Select The Machine Template </Divider>
                  </Grid>

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
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Select Model
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Model Name"
                        name="type"
                        onChange={(e) => onChangeTemplate(e.target.value)}
                        value={selectedTemplate?.id}
                      >
                        {templates.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={5}>
                  <Grid
                    item
                    md={6}
                    xs={12}
                    sx={{
                      marginBottom: "10px",
                      paddingLeft: "60px !important",
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid md={12} xs={12} sx={{ marginBottom: "60px" }}>
                        <Grid
                          item
                          md={12}
                          xs={12}
                          sx={{ marginBottom: "40px" }}
                        >
                          <Divider> Business </Divider>
                        </Grid>
                        <Grid container spacing={3}>
                          <Grid item md={12} xs={12}>
                            <TextField
                              fullWidth
                              label="Machine ID"
                              name="businessId"
                              variant="outlined"
                              value={customId}
                              onChange={(e) => setCustomId(e.target.value)}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid md={12} xs={12}>
                        <Grid
                          item
                          md={12}
                          xs={12}
                          sx={{ marginBottom: "40px" }}
                        >
                          <Divider> Machine Details </Divider>
                        </Grid>

                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 650 }}
                            aria-label="simple table"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Power</TableCell>
                                <TableCell align="right">Charge Type</TableCell>
                                <TableCell align="right">
                                  OCPP Version
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  {get(selectedTemplate, "charger.name", "--")}
                                </TableCell>
                                <TableCell align="right">
                                  {get(selectedTemplate, "charger.power", "--")}{" "}
                                  KW
                                </TableCell>
                                <TableCell align="right">
                                  {get(selectedTemplate, "charger.type", "--")}
                                </TableCell>
                                <TableCell align="right">
                                  {OCPP[
                                    get(
                                      selectedTemplate,
                                      "charger.ocppVersion",
                                      ""
                                    )
                                  ] || "--"}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                    sx={{
                      marginBottom: "10px",
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid md={12} xs={12} sx={{ marginBottom: "60px" }}>
                        <Grid
                          item
                          md={12}
                          xs={12}
                          sx={{ marginBottom: "40px" }}
                        >
                          <Divider> Tariffs </Divider>
                        </Grid>
                        <Grid container spacing={3}>
                          <Grid item md={6} xs={12}>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                Default Tariff *
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Default Tariff *"
                                name="type"
                                onChange={(e) =>
                                  onChangeTariff(e.target.value, "default")
                                }
                                value={selectedDefaultTariff?.name}
                              >
                                {defaultTariffs.map((item) => (
                                  <MenuItem key={item.name} value={item.name}>
                                    {item.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                Special Tariff ( optional )
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Special Tariff ( optional )"
                                name="type"
                                onChange={(e) =>
                                  onChangeTariff(e.target.value, "special")
                                }
                                value={selectedSpecialTariff?.name}
                              >
                                {specialTariffs.map((item) => (
                                  <MenuItem key={item.name} value={item.name}>
                                    {item.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid md={12} xs={12}>
                        <Grid
                          item
                          md={12}
                          xs={12}
                          sx={{ marginBottom: "40px" }}
                        >
                          <Divider> Plug Details </Divider>
                        </Grid>

                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 650 }}
                            aria-label="simple table"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>Plug</TableCell>
                                <TableCell align="right">Port Type </TableCell>
                                <TableCell align="right">Power O/P</TableCell>
                                <TableCell align="right">
                                  Default Tariff
                                </TableCell>
                                <TableCell align="right">
                                  Special Tariff
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {get(selectedTemplate, "charger.plugs", []).map(
                                (row) => (
                                  <TableRow
                                    key={row.id}
                                    sx={{
                                      "&:last-child td, &:last-child th": {
                                        border: 0,
                                      },
                                    }}
                                  >
                                    <TableCell component="th" scope="row">
                                      {row.name}
                                    </TableCell>
                                    <TableCell align="right">
                                      {row.supportedPort}
                                    </TableCell>
                                    <TableCell align="right">
                                      {row.power} KW
                                    </TableCell>
                                    <TableCell align="right">
                                      ₹
                                      {getTariffPrice(
                                        row.supportedPort,
                                        row.power,
                                        selectedDefaultTariff?.ports || []
                                      )}
                                      /unit
                                    </TableCell>
                                    <TableCell align="right">
                                      ₹
                                      {getTariffPrice(
                                        row.supportedPort,
                                        row.power,
                                        selectedSpecialTariff?.ports || []
                                      )}
                                      /unit
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* <Grid item md={4} xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isActive}
                          onChange={() => setIsActive(!isActive)}
                          name="isActive"
                        />
                      }
                      label={isActive ? "Active" : "Inactive"}
                    />
                  </Grid> */}
                </Grid>

                <Grid container spacing={3}>
                  <Grid item md={12} xs={12} sx={{ marginBottom: "10px" }}>
                    <Button
                      color="primary"
                      variant="contained"
                      sx={{ marginTop: 3, float: "right" }}
                      onClick={onChargerSubmit}
                      disabled={!checkIfAllDataValid()}
                    >
                      UPDATE CHARGER
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </React.Fragment>
        )}
        {newChargerData && (
          <Card sx={{ height: "500px" }}>
            <CardContent>Charger Added Successfully</CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default NewMachine;
