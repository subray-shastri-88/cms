import React, { useState, useEffect } from "react";
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
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import ErrorBox from "../ui/ErrorBox/ErrorBox";
import { emptyValueChecker } from "../../utils/jsUtils";
import { WithCpoCtx } from "../../contexts/cpoContext";
import { saveCorporate } from "../../graphQL/corporate";
import { useMutation, error } from "@apollo/client";
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

const NewCorporate = ({ header, cpos, reloadCorps }) => {
  const [open, setOpen] = useState(false);

  const defaultData = {
    name: "",
    cpo: "",
    city: "",
    line1: "",
    line2: "",
    state: "",
    zip: "",
    phone: "",
    reg: "",
    gst: "",
    email: "",
    type: "",
    contractStart: new Date(),
    contractEnd: new Date(),
  };

  const [createNewCorporate, { data, loading, error: err }] = useMutation(
    saveCorporate,
    {
      variables: {
        input: {
          name: null,
          businessType: null,
          address: {
            line1: null,
            line2: null,
            city: null,
            state: null,
            zip: null,
            phone: null,
          },
          registrationNumber: null,
          gst: null,
          contractStartDate: null,
          contractEndDate: null,
          fleetType: null,
          email: null,
          phone: null,
        },
      },
    }
  );

  const [partnerData, setPartnerData] = useState(defaultData);

  const [error, setError] = useState(false);

  const handleChange = (event) => {
    setPartnerData({
      ...partnerData,
      [event.target.name]: event.target.value,
    });
  };

  const handleStartDate = (value) => {
    setPartnerData({
      ...partnerData,
      contractStart: value,
    });
  };

  const handleEndDate = (value) => {
    setPartnerData({
      ...partnerData,
      contractEnd: value,
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setPartnerData(defaultData);
    setOpen(false);
  };

  const checkIfAllFieldsAvailable = () => {
    const address =
      partnerData.line1 &&
      partnerData.line2 &&
      partnerData.city &&
      partnerData.state &&
      partnerData.zip &&
      partnerData.phone;
    const basic =
      partnerData.name &&
      partnerData.phone &&
      partnerData.reg &&
      partnerData.gst &&
      partnerData.contractStart &&
      partnerData.contractEnd &&
      partnerData.type &&
      partnerData.email;
    return address && basic;
  };

  const onFormSubmit = () => {
    createNewCorporate({
      variables: {
        input: {
          address: {
            line1: partnerData.line1,
            line2: partnerData.line2,
            city: partnerData.city,
            state: partnerData.state,
            zip: partnerData.zip,
            phone: partnerData.phone,
          },
          name: partnerData.name,
          phone: partnerData.phone,
          registrationNumber: partnerData.reg,
          gst: partnerData.gst,
          contractStartDate: partnerData.contractStart,
          contractEndDate: partnerData.contractEnd,
          fleetType: partnerData.type,
          email: partnerData.email,
        },
      },
    });

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Partner added successfully!",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };
  useEffect(() => {
    handleClose();
    setPartnerData(defaultData);
    reloadCorps();
  }, [loading]);

  return (
    <React.Fragment>
      <Button
        color="primary"
        variant="contained"
        onClick={handleOpen}
        sx={{ position: "absolute", top: "25px", right: 15 }}
      >
        Add New Partner
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
            width: "800px",
            maxHeight: "700px",
            overflowY: "scroll",
          }}
        >
          {error && <ErrorBox message="Please Enter all fields" />}
          <Card>
            <CardHeader subheader="Enter the Partner Details" title={header} />
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
                    value={partnerData.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">CPO</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Select CPO"
                      name="cpo"
                      onChange={handleChange}
                      value={partnerData.cpo}
                      key="Cpolist"
                    >
                      {cpos.map((item) => (
                        <MenuItem key={item.label} value={item.label}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardHeader subheader="Account Details" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Registration Number"
                    name="reg"
                    onChange={handleChange}
                    required
                    value={partnerData.reg}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="GST"
                    name="gst"
                    onChange={handleChange}
                    required
                    value={partnerData.gst}
                    variant="outlined"
                  />
                </Grid>

                <Grid item md={4} xs={12}>
                  <MobileDatePicker
                    required
                    fullWidth
                    label="Contract Start"
                    inputFormat="MM/dd/yyyy"
                    variant="outlined"
                    name="contractStart"
                    value={partnerData.contractStart}
                    onChange={handleStartDate}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>

                <Grid item md={4} xs={12}>
                  <MobileDatePicker
                    required
                    fullWidth
                    label="Contract End"
                    inputFormat="MM/dd/yyyy"
                    variant="outlined"
                    name="contractEnd"
                    value={partnerData.contractEnd}
                    onChange={handleEndDate}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Fleet Type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Fleet Type"
                      name="type"
                      onChange={handleChange}
                      value={partnerData.type}
                    >
                      <MenuItem value={"2W"}>2W</MenuItem>
                      <MenuItem value={"3W"}>3W</MenuItem>
                      <MenuItem value={"LMV"}>LMV</MenuItem>
                      <MenuItem value={"HMV"}>HMV</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardHeader subheader="Contact Details" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    onChange={handleChange}
                    required
                    value={partnerData.email}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Contact Number "
                    name="phone"
                    onChange={handleChange}
                    required
                    value={partnerData.phone}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Address Line 1"
                    name="line1"
                    onChange={handleChange}
                    required
                    value={partnerData.line1}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Address Line 2"
                    name="line2"
                    onChange={handleChange}
                    required
                    value={partnerData.line2}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    onChange={handleChange}
                    required
                    value={partnerData.city}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    label="State"
                    name="state"
                    onChange={handleChange}
                    required
                    value={partnerData.state}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    label="Pincode"
                    name="zip"
                    onChange={handleChange}
                    required
                    value={partnerData.zip}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Divider />
          <Button
            color="primary"
            variant="contained"
            sx={{ marginTop: 3, float: "right" }}
            onClick={onFormSubmit}
            disabled={!checkIfAllFieldsAvailable()}
          >
            SUBMIT
          </Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default WithCpoCtx(NewCorporate);
