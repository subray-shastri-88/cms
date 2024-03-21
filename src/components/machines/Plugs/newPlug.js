import React, { useState, useEffect } from "react";
import { get } from "lodash";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import {
  addNewPlugType,
  updatePlugType,
  updatePlug,
} from "../../../graphQL/machines/plugs";
import Ring from "../../ui/Loader/Ring";
import { status } from "nprogress";

const NewPlug = ({ plug, open, setOpen }) => {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [type, setType] = useState("");
  const [power, setPower] = useState([
    {
      value: "",
    },
  ]);
  const [isActive, setIsActive] = useState(true);

  const [createNewPlug, { data: createNewPlugData }] = useMutation(
    addNewPlugType,
    {
      variables: {
        input: {
          name: "",
          supportedPowers: [],
          type: "",
          id: "",
        },
      },
    }
  );

  const [updatePlugMutation, { data: updatePlugData }] = useMutation(
    updatePlugType,
    {
      variables: {
        input: {
          name: "",
          supportedPowers: [],
          type: "",
          id: "",
        },
      },
    }
  );

  const [updatePlugchange, { data: updatePlugChangeData }] = useMutation(
    updatePlug,
    {
      variables: {
        input: {
          name: "",
          status: "",
        },
      },
    }
  );

  const handleAddPower = () => {
    const plugs = [
      ...power,
      {
        value: "",
      },
    ];
    setPower(plugs);
  };

  const handlePowerChange = (e, ind) => {
    const prevData = [...power];
    prevData[ind] = {
      value: e.target.value,
    };
    setPower(prevData);
  };

  const checkSpecialChar = (evt) => {
    const newName = evt.target.value;
    setName(newName);
  };
  const displayNameChecker = (evt) => {
    const newName = evt.target.value;
    setDisplayName(newName);
  };

  const handleSubmit = () => {
    const dataToUpload = {
      variables: {
        input: {
          name: displayName,
          supportedPowers: power.map((p) => Number(p.value)).filter((e) => e),
          type: type,
          id: name,
          // status: isActive,
        },
      },
    };
    if (plug) {
      updatePlugMutation(dataToUpload);
    } else {
      createNewPlug(dataToUpload);
    }

  };

  const clearData = () => {
    if (name || displayName || type || power[0].value) {
      setPower([
        {
          value: "",
        },
      ]);
      setName("");
      setDisplayName("");
      setType("");
    }
  };

  useEffect(() => {
    if (plug) {
      setName(plug.id);
      setDisplayName(plug.name);
      setType(plug.type);
      // setIsActive(plug.isActive);
      setPower(
        plug.supportedPowers.map((pw) => {
          return {
            value: pw,
          };
        })
      );
    }
  }, [plug]);

  useEffect(() => {
    if (!open) {
      clearData();
    }
  }, [open]);

  useEffect(() => {
    if (createNewPlugData) {
      setOpen(false);
    }
  }, [createNewPlugData]);

  useEffect(() => {
    if (updatePlugData) {
      setOpen(false);
    }
  }, [updatePlugData]);

  const isSubmitDisabled =
    !name ||
    !displayName ||
    !type ||
    power.some((p) => !p.value)
    // isActive === undefined;

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          position: "fixed",
          top: "5%",
          left: "0",
          right: "0",
          width: "50vw",
          margin: "auto",
          overflowY: "scroll",
        }}
      >
        <Card>
          <CardHeader
            subheader="Enter the Plug Details"
            title={`Add New Plug`}
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label="Plug Name"
                  name="plug name"
                  value={name}
                  onChange={(e) => checkSpecialChar(e)}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <TextField
                  fullWidth
                  label="Display Name"
                  name="Display name"
                  value={displayName}
                  onChange={(e) => displayNameChecker(e)}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Type"
                    name="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <MenuItem value={"AC"}>AC</MenuItem>
                    <MenuItem value={"DC"}>DC</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={12} xs={12}>
                <p> Supported Powers : </p>
              </Grid>
              {power.map((pw, index) => (
                <Grid item md={3} xs={12} key="">
                  <TextField
                    fullWidth
                    label="Power"
                    name="power"
                    onChange={(e) => handlePowerChange(e, index)}
                    value={pw.value}
                    InputProps={{
                      endAdornment: (
                        <React.Fragment>
                          <InputAdornment position="end">KW</InputAdornment>
                          <Button
                            onClick={handleAddPower}
                            variant="contained"
                            size="small"
                            sx={{ marginLeft: "20px" }}
                          >
                            +
                          </Button>
                        </React.Fragment>
                      ),
                    }}
                  />
                </Grid>
              ))}
              {/* <Grid item md={4} xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isActive}
                      onChange={(e) => setIsActive((prevActive) => !prevActive)}
                      name="isActive"
                    />
                  }
                  label={isActive ? "Active" : "Inactive"}
                />
              </Grid> */}

              <Grid item md={12} xs={12}>
                <Button
                  loadingPosition="end"
                  variant="contained"
                  size="large"
                  sx={{ width: "100%" }}
                  disabled={isSubmitDisabled} 
                  onClick={handleSubmit}
                >
                  {plug ? "Update" : "Add"}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Modal>
    </React.Fragment>
  );
};

export default NewPlug;
