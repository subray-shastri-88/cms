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
  Autocomplete,
  FormControlLabel,
  Switch,
  FormGroup,
  Typography,
  Checkbox,
} from "@mui/material";

import { WithCpoCtx } from "../../contexts/cpoContext";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { getMachineMakers, createMachine } from "../../graphQL/machines/makes";
import { getPortTypes } from "../../graphQL/machines/plugs";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import { updateTariff } from "../../graphQL/tariff";
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

const NewTariff = ({ allPartners, tariffData }) => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [portTypes, setPortTypes] = useState([]);
  const [name, setName] = useState("");
  const [cpo, setCpo] = useState("");
  const [isDefault, setIsDefault] = useState(true);
  const [open, setOpen] = useState(false);

  const [getPortypes, { data: PortTypesData, loading }] =
    useLazyQuery(getPortTypes);

  const handleTariffChange = (index, event) => {
    let allPorts = [...portTypes];
    allPorts[index] = {
      ...allPorts[index],
      tariff: event.target.value.replace(/[^0-9.\s]/g, "").replace(/\s+/g, ""),
    };
    setPortTypes([...allPorts]);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const checkIfDataValid = () => {
    const primary = name && cpo && cpo.id;
    const secondary = isDefault ? isDefault : startDate && endDate;
    const checkedList = portTypes.filter((item) => item.checked);
    const isPlugsValid = checkedList.every((item) => item.tariff);
    return primary && secondary && checkedList.length > 0 && isPlugsValid;
  };

  const handleStartDateChange = (newValue) => {
    const dt = new Date(newValue);
    setStartDate(dt);
  };

  const handleEndDateChange = (newValue) => {
    const dt = new Date(newValue);
    setEndDate(dt);
  };

  const handleCpoChange = (value) => {
    setCpo(value);
  };

  useEffect(() => {
    getPortypes();
  }, [open]);

  useEffect(() => {
    if (PortTypesData) {
      const allPorts = get(PortTypesData, "PortTypes", []);
      const allPlugs = [];
      allPorts.map((port) => {
        port.supportedPowers.map((pw) => {
          allPlugs.push({
            name: port.name,
            power: pw,
            type: port.type,
            id: port.id,
            tariff: 0,
            checked: true,
          });
        });
      });
      setPortTypes(allPlugs);
    }
  }, [PortTypesData, loading]);

  const [createNewTariff, { data: createNewTariffData }] = useMutation(
    updateTariff,
    {
      variables: {
        cpoId: null,
        input: {
          endDate: null,
          isDefault: null,
          name: null,
          ports: [
            {
              config: [
                {
                  powerRating: null,
                  powerType: null,
                  pricePerUnit: null,
                },
              ],
              portType: null,
            },
          ],
          startDate: null,
        },
      },
    }
  );

  const onTariffSubmit = () => {
    let dataToSubmit = {
      cpoId: cpo.id,
      input: {
        isDefault,
        name,
      },
    };
    if (!isDefault) {
      dataToSubmit.input["startDate"] = startDate;
      dataToSubmit.input["endDate"] = endDate;
    }
    const checkedList = portTypes.filter((item) => item.checked);
    const portObject = {};
    checkedList.map((item) => {
      const config = {
        powerRating: item.power,
        powerType: item.type,
        pricePerUnit: parseFloat(item.tariff),
      };
      if (!portObject[item.id]) {
        portObject[item.id] = {
          config: [config],
          portType: item.id,
        };
      } else if (portObject[item.id]) {
        portObject[item.id].config.push(config);
      }
    });
    const finalPlugsData = Object.values(portObject);

    dataToSubmit.input["ports"] = finalPlugsData;
    createNewTariff({
      variables: {
        ...dataToSubmit,
      },
    });
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "tariff updated successfully",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const reset = () => {
    setName("");
    setCpo();
    setIsDefault(true);
    setPortTypes([]);
    setStartDate();
    setEndDate();
  };

  const onPortUnselect = (e, index) => {
    const allPortsData = [...portTypes];
    allPortsData[index] = {
      ...allPortsData[index],
      checked: e.target.checked,
    };
    setPortTypes(allPortsData);
  };

  useEffect(() => {
    setOpen(false);
    reset();
  }, [createNewTariffData]);

  return (
    <React.Fragment>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Edit
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: "1500px" }}>
          <Card>
            <CardHeader
              subheader="Enter the Tariff Details"
              title={`New Tariff Plan`}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Tariff Name"
                    name="name"
                    onChange={(e) => setName(e.target.value)}
                    required
                    value={name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <Autocomplete
                    fullWidth
                    required
                    disablePortal
                    id="combo-box-demo"
                    options={allPartners}
                    value={cpo}
                    onChange={(event, newValue) => handleCpoChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        required
                        {...params}
                        label="Select Partner"
                        variant="outlined"
                      />
                    )}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={2}
                  xs={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          onChange={(e) => setIsDefault(e.target.checked)}
                          checked={isDefault}
                          size="large"
                        />
                      }
                      label="Default"
                    />
                  </FormGroup>
                </Grid>
                <Grid item md={3} xs={12}>
                  <DateTimePicker
                    fullWidth
                    disabled={isDefault}
                    label="Start Date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    renderInput={(params) => <TextField {...params} />}
                    sx={{ width: "100%" }}
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <DateTimePicker
                    fullWidth
                    disabled={isDefault}
                    label="End Date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
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
                      maxHeight: "600px",
                      overflowY: "scroll",
                    }}
                  >
                    <Typography sx={{ marginLeft: 3 }} variant="h6">
                      Tariffs
                    </Typography>

                    {portTypes.map((plug, index) => (
                      <React.Fragment key={`Plug-${index}`}>
                        <Grid
                          container
                          spacing={3}
                          sx={{
                            marginTop: 1,
                            paddingX: 3,
                          }}
                        >
                          <Grid item md={1} xs={12}>
                            <Checkbox
                              checked={plug.checked}
                              onChange={(e) => onPortUnselect(e, index)}
                            />
                          </Grid>
                          <Grid item md={3} xs={12}>
                            <TextField
                              fullWidth
                              label="Plug Name"
                              variant="outlined"
                              value={plug.name}
                              disabled={!plug.checked}
                            />
                          </Grid>
                          <Grid item md={2} xs={12}>
                            <TextField
                              fullWidth
                              label="Power Type"
                              variant="outlined"
                              value={plug.type}
                              disabled={!plug.checked}
                            />
                          </Grid>
                          <Grid item md={3} xs={12}>
                            <TextField
                              fullWidth
                              label="Power"
                              variant="outlined"
                              value={plug.power}
                              disabled={!plug.checked}
                            />
                          </Grid>
                          <Grid item md={3} xs={12}>
                            <TextField
                              fullWidth
                              label="Price Per Unit"
                              name="tariffAmount"
                              required
                              variant="outlined"
                              value={plug.tariff}
                              disabled={!plug.checked}
                              onChange={(e) =>
                                handleTariffChange(index, e, plug, "amount")
                              }
                            />
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
            onClick={onTariffSubmit}
            disabled={!checkIfDataValid()}
          >
            Update Tariff
          </Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default NewTariff;
