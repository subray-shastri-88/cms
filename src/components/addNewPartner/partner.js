import React, { useEffect, useState } from "react";
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
  Autocomplete,
  ListItemText,
  MenuItem,
  InputLabel,
  FormControl,
  outlinedInput,
} from "@mui/material";
import Ring from "../ui/Loader/Ring";
import ErrorBox from "../ui/ErrorBox/ErrorBox";
import { emptyValueChecker } from "../../utils/jsUtils";
import createCPO from "../../graphQL/cpo/createCpo";
import { useMutation, error } from "@apollo/client";
import { WithCpoCtx } from "../../contexts/cpoContext";
import Swal from "sweetalert2";
import { StateList, CityList } from "src/utils/common";
import { State, City } from 'country-state-city';
import { CountryCode } from "src/utils/config";
import { get } from 'lodash'

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
  overflow: "scroll",
  height: "100%",
  display: "block",
};

const NewPartner = ({ defaultType, header, loadCpoList, loadIsoList }) => {
  const [open, setOpen] = useState(false);
  const [allStateList, setAllStateList] = useState();
  const [state, setState] = useState();
  const [allCityList, setAllCityList] = useState();
  const [city, setCity] = useState();
  const defaultData = {
    name: "",
    type: defaultType,
    city: city?.name,
    line1: "",
    line2: "",
    state: state?.name,
    zip: "",
    phone: "",
    // ac: "",
    // dc: "",
    gst: "",
    pan: "",
    accountNumber: "",
    ifsc: "",
  };

  const [createNewCPO, { data, loading, error: err }] = useMutation(createCPO, {
    variables: {
      input: {
        address: {
          city: "",
          phone: "",
          line1: "",
          line2: "",
          state: "",
          zip: "",
        },
        billing: {
          accountNumber: "",
          gst: "",
          ifsc: "",
          pan: "",
        },
        kind: "",
        name: "",
        // perUnitAcCharge: 0.0,
        // perUnitDcCharge: 0.0,
        phone: "",
        revenuePlan: null,
      },
    },
  });

  const [partnerData, setPartnerData] = useState(defaultData);

  const [error, setError] = useState(false);

  const handleChange = (event) => {
    setPartnerData({
      ...partnerData,
      [event.target.name]: event.target.value,
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setPartnerData(defaultData);
    setOpen(false);
  };

  const handleDownload = () => {
    // Logic to generate and download the invoice
  };

  const onFormSubmit = () => {
    setError(false);
    const checkIfEmpty = emptyValueChecker(partnerData);
    if (checkIfEmpty) {
      setError(true);
    } else {
      createNewCPO({
        variables: {
          input: {
            address: {
              line1: partnerData.line1,
              line2: partnerData.line2,
              city: city.name,
              state: state.name,
              zip: partnerData.zip,
              phone: partnerData.phone,
            },
            billing: {
              gst: partnerData.gst,
              pan: partnerData.pan,
              accountNumber: partnerData.accountNumber,
              ifsc: partnerData.ifsc,
            },
            kind: defaultType,
            name: partnerData.name,
            // perUnitAcCharge: Number.parseFloat(partnerData.ac),
            // perUnitDcCharge: Number.parseFloat(partnerData.dc),
            phone: partnerData.phone,
          },
        },
      });
    }
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "New operator successfully added.",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  useEffect(() => {
    handleClose();
    setPartnerData(defaultData);
    defaultType === "ISO" ? loadIsoList() : loadCpoList();
  }, [data, loading, err]);

  console.log(partnerData)

  useEffect(() => {
    let allStatesFromCountry = State.getStatesOfCountry(CountryCode.IN);
    let allStates = allStatesFromCountry.map((item) => {
      return { name: item.name || '', isoCode: item.isoCode || '', label: item.name || '' }
    })
    allStates = allStates.filter((item) => item.name)
    setAllStateList(allStates)

    console.log()

    if (state && state !== undefined) {
      let stateId = get(state, 'isoCode', '')
      let allCitiesFromState = City.getCitiesOfState(CountryCode.IN, stateId);
      let allCities = allCitiesFromState.map((item) => {
        return { name: item.name || '', stateCode: item.stateCode || '', label: item.name || '' }
      })
      allCities = allCities.filter((item) => item.name)
      setAllCityList(allCities)
    }
  }, [state])

  return (
    <React.Fragment>
      <Button
        color="primary"
        variant="contained"
        onClick={handleOpen}
        sx={{ position: "absolute", top: "25px", right: 30 }}
      >
        Add New Operators
      </Button>

      {/* <Button
        color="primary"
        variant="contained"
        onClick={handleDownload}
        sx={{ position: "absolute", top: "25px", right: 220 }}
      >
        Download Invoice
      </Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            ...style,
            // width: '900px',
            // maxHeight: '900px',
            // overflowY: 'scroll'
          }}
        >
          {err && <ErrorBox message="Something Went Wrong" />}
          {loading && <Ring />}
          {error && <ErrorBox message="Please Enter all fields" />}
          <Card>
            <CardHeader subheader="" title={header} />
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
                    <InputLabel id="demo-simple-select-label">
                      Partner Type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Partner Type"
                      name="type"
                      onChange={handleChange}
                      value={partnerData.type}
                      disabled={defaultType}
                    >
                      <MenuItem value={"CPO"}>CPO</MenuItem>
                      <MenuItem value={"ISO"}>ISO</MenuItem>
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
                <Grid item md={6} xs={12}>
                  <StateList state={state} handleStateChange={setState} allStates={allStateList} />
                </Grid>
                <Grid item md={6} xs={12}>
                  {/* <TextField
                    fullWidth
                    label="State"
                    name="state"
                    onChange={handleChange}
                    required
                    value={partnerData.state}
                    variant="outlined"
                  /> */}
                  {/* <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    value={state}
                    onChange={(event) => {}}
                    options={allStateList?.map((option) => option.name)}
                    renderInput={(params) => <TextField {...params} label="freeSolo" />}
                  /> */}
                  <CityList city={city} handleCityChange={setCity} allCities={allCityList} />
                </Grid>
                <Grid item md={6} xs={12}>
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
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Contact Number"
                    name="phone"
                    onChange={handleChange}
                    required
                    value={partnerData.phone}
                    variant="outlined"
                  />
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
                    label="PAN"
                    name="pan"
                    onChange={handleChange}
                    required
                    value={partnerData.pan}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="GST No."
                    name="gst"
                    onChange={handleChange}
                    required
                    value={partnerData.gst}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Bank Account Number"
                    name="accountNumber"
                    onChange={handleChange}
                    required
                    value={partnerData.accountNumber}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="IFSC"
                    name="ifsc"
                    onChange={handleChange}
                    required
                    value={partnerData.ifsc}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader subheader="Default Prices" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="AC Charge Price"
                    name="ac"
                    onChange={handleChange}
                    required
                    value={partnerData.ac}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="DC Charge Price"
                    name="dc"
                    onChange={handleChange}
                    required
                    value={partnerData.dc}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card> */}

          <Divider />
          <Button
            color="primary"
            variant="contained"
            sx={{ marginTop: 3, float: "right" }}
            onClick={onFormSubmit}
          >
            SUBMIT
          </Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default WithCpoCtx(NewPartner);
