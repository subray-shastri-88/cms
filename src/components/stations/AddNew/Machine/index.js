import React, { useState } from "react";
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
} from "@mui/material";
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

const NewMachine = ({ addCharger, disabled }) => {
  const chargerSchema = {
    label: "",
    name: "",
    power: "",
    type: "",
    ocppVersion: "",
    plugs: [
      {
        name: "",
        supportedPort: "",
      },
      {
        name: "",
        supportedPort: "",
      },
    ],
  };
  const [open, setOpen] = useState(false);
  const [charger, setCharger] = useState(chargerSchema);

  const plugSchema = {
    id: "",
    supportedPort: "",
  };

  const handleChange = (event) => {
    setCharger({
      ...charger,
      [event.target.name]: event.target.value,
    });
  };

  const handlePlugsChange = (index, event) => {
    const plugs = charger.plugs;

    const selectedPlug = {
      ...plugs[index],
      [event.target.name]: event.target.value,
    };
    plugs[index] = selectedPlug;

    setCharger({
      ...charger,
      plugs,
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const removePlug = (index) => {
    if (index > -1) {
      const plugs = [...charger.plugs];
      plugs.splice(index, 1);
      setCharger({
        ...charger,
        plugs,
      });
    }
  };

  const onChargerSubmit = () => {
    addCharger(charger);
    handleClose();
    setCharger(chargerSchema);
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "New charger successfully added.",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const addPlugHandler = () => {
    const plugs = [...charger.plugs, plugSchema];
    setCharger({
      ...charger,
      plugs,
    });
  };

  return (
    <React.Fragment>
      <Button
        color="primary"
        variant="contained"
        onClick={handleOpen}
        sx={{ margin: 2.5, float: "right" }}
        disabled={disabled}
      >
        Add Charger +
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: "1400px" }}>
          <Card>
            <CardHeader
              subheader="Enter the Machine Details"
              title={`Add New Machine`}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
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
                <Grid item md={6} xs={12}>
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
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Power in KW"
                    name="power"
                    onChange={handleChange}
                    required
                    value={charger.power}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
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
                    {charger.plugs.map((plug, index) => (
                      <React.Fragment key={`Plug${index}`}>
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
                            <TextField
                              fullWidth
                              label="Id"
                              name="name"
                              onChange={(e) => handlePlugsChange(index, e)}
                              required
                              value={plug.name}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item md={4} xs={12}>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                Plug-Type
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Plug-Type"
                                name="supportedPort"
                                onChange={(e) => handlePlugsChange(index, e)}
                                value={plug.supportedPort}
                              >
                                {charger.type === "DC" && (
                                  <MenuItem value={"CCS2"}>CCS 2</MenuItem>
                                )}
                                {charger.type === "DC" && (
                                  <MenuItem value={"CHADEMO"}>CHAdeMO</MenuItem>
                                )}
                                {charger.type === "DC" && (
                                  <MenuItem value={"GBT"}>GB/T</MenuItem>
                                )}
                                {charger.type === "AC" && (
                                  <MenuItem value={"TYPE1"}>TYPE 1</MenuItem>
                                )}
                                {charger.type === "AC" && (
                                  <MenuItem value={"TYPE2"}>TYPE 2</MenuItem>
                                )}
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
          >
            ADD CHARGER
          </Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default NewMachine;
