import React, { useState, useEffect } from "react";
import { get } from "lodash";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Autocomplete,
} from "@mui/material";
import Ring from "../../ui/Loader/Ring";
import stationRequest from "../../../graphQL/stations";
import { emptyValueChecker } from "../../../utils/jsUtils";
import { useMutation } from "@apollo/client";
import { WithCpoCtx } from "../../../contexts/cpoContext";
import ErrorBox from "../../ui/ErrorBox/ErrorBox";
import Swal from "sweetalert2";
import { stationImages } from '../../../../assets/stationImages';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const NewStation = ({ allPartners, handleModalClose, refetchStationData }) => {
  const AmenitiesList = [
    "Restaurant",
    "Wifi",
    "Cafe",
    "Park",
    "RestRooms",
    "Baby Care",
    "Shopping",
  ];
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [chargers, setChargers] = useState([]);
  const [error, setError] = useState(false);
  const [cpoList, setCpoList] = useState(allPartners);
  const [isFieldsEmpty, setIsFieldsEmpty] = useState(true);

  const defaultValues = {
    stationName: "",
    stationType:"",
    addressOne: "",
    addressTwo: "",
    city: "",
    state: "",
    zip: "",
    stationDescription: "",
    cpo: "",
    longitude: "",
    latitude: "",
    maplink: "",
    slotTimeInMin: "",
    // contactPerson: "",
    // contactNumber: ""
  };

  const [values, setValues] = useState(defaultValues);

  const { createStation, createCharger } = stationRequest;

  const [createNewStation, { data, loading, error: err }] = useMutation(
    createStation,
    {
      variables: {
        input: {
          name: values.stationName,
          description: values.stationDescription,
          stationType: values.stationType,
          address: {
            line1: values.addressOne,
            line2: values.addressTwo,
            city: values.city,
            state: values.state,
            zip: values.zip,
            // phone: values.phone,
          },
          position: {
            latitude: values.latitude,
            longitude: values.longitude,
          },
          amenities: [
            {
              name: "RESTAURANT",
              value: "Open 10 AM to 10 PM",
            },
          ],
          chargers: [],
          status: "ACTIVE",
          flag: "",
          images: stationImages,
          cpoId: "CPO-6VZX",
          location: "https://goo.gl/dvsdvsv",
          // slotTimeInMin: "",
          // contactNumber: values.contactNumber,
          // contactPerson: values.contactPerson
        },
      },
    }
  );

  const timeSlots = [
    { label: "15 Minutes", value: "15" },
    { label: "30 Minutes", value: "30" },
    { label: "1 Hour", value: "60" },
    { label: "2 Hours", value: "120" },
    { label: "5 Hours", value: "300" },
    { label: "Max", value: "540" },
  ];

  const stationTypes = [
    { label: "PUBLIC", value: "PUBLIC" },
    { label: "PRIVATE", value: "PRIVATE" },
    { label: "CAPTIVE", value: "CAPTIVE" }
  ];

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleAmenities = (event) => {
    const {
      target: { value },
    } = event;
    setValues({
      ...values,
      amenities: typeof value === "string" ? value.split(",") : value,
    });
  };

  const handleCpoChange = (value) => {
    setValues({
      ...values,
      cpo: value,
    });
  };

  const handleTimeSlotChange = (value) => {
    setValues({
      ...values,
      slotTimeInMin: value,
    });
  };

  const handleStationTypeChange = (value) => {
    setValues({
      ...values,
      stationType: value,
    });
  };

  const handleSubmit = () => {
    createNewStation({
      variables: {
        input: {
          name: values.stationName,
          description: values.stationDescription,
          stationType: get(values, "stationType.value", ""),
          address: {
            line1: values.addressOne,
            line2: values.addressTwo,
            city: values.city,
            state: values.state,
            zip: values.zip,
            // phone: values.phone,
          },
          position: {
            latitude: Number(values.latitude),
            longitude: Number(values.longitude),
          },
          amenities: [
            {
              name: "RESTAURANT",
              value: "Open 10 AM to 10 PM",
            },
          ],
          status: "ACTIVE",
          flag: "",
          images: stationImages,
          cpoId: get(values, "cpo.id", ""),
          location: values.maplink,
          chargers: [],
          slotTimeInMin: get(values, "slotTimeInMin.value", ""),
          // contactNumber: values.contactNumber,
          // contactPerson: values.contactPerson
        },
      },
    });
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "New station successfully created.",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  useEffect(() => {
    const checkIfEmpty = emptyValueChecker(values);
    setIsFieldsEmpty(checkIfEmpty);
  }, [values]);

  useEffect(() => {
    setCpoList(allPartners);
  }, [allPartners]);

  useEffect(() => {
    if (data) {
      if (!loading && !err) {
        handleModalClose();
        refetchStationData(1);
      }
    }
  }, [data]);

  // const handleTimeSlotChange = (e) => {
  //   setSelectedTimeSlot(e.target.value);
  // };

  return (
    <Box
      sx={{ background: "#fff", padding: "34px 100px", borderRadius: "2px" }}
    >
      <form autoComplete="off" noValidate>
        {loading && <Ring />}

        <Grid container spacing={1}>
          <Grid item md={12} xs={10}>
            <Card>
              <CardHeader
                subheader="Add the business name of Charging Center"
                title="Station Details"
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  {(error || err) && (
                    <ErrorBox message="Something Went Wrong" />
                  )}
                  <Grid item md={4} xs={10}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="stationName"
                      onChange={handleChange}
                      required
                      value={values.stationName}
                      variant="filled"
                      disabled={get(data, "createStation.data.id")}
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      id="combo-box-demo"
                      options={cpoList}
                      onChange={(event, newValue) => handleCpoChange(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Partner"
                          variant="filled"
                        />
                      )}
                      disabled={get(data, "createStation.data.id")}
                      variant="filled"
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      id="combo-box-demo"
                      options={stationTypes}
                      onChange={(event, newValue) =>
                        handleStationTypeChange(newValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Station type"
                          variant="filled"
                        />
                      )}
                      disabled={get(data, "createStation.data.id")}
                      variant="filled"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="stationDescription"
                      onChange={handleChange}
                      value={values.stationDescription}
                      variant="filled"
                      disabled={get(data, "createStation.data.id")}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={3}
          sx={{
            marginTop: "10px",
            position: "relative",
          }}
        >
          <Grid item md={8} xs={12}>
            <Card>
              <CardHeader
                subheader="Add the address of Charging Center"
                title="Location Details"
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Address Line 1"
                      name="addressOne"
                      onChange={handleChange}
                      required
                      value={values.addressOne}
                      variant="filled"
                      disabled={get(data, "createStation.data.id")}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Address Line 2"
                      name="addressTwo"
                      onChange={handleChange}
                      required
                      value={values.addressTwo}
                      variant="filled"
                      disabled={get(data, "createStation.data.id")}
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      onChange={handleChange}
                      required
                      value={values.city}
                      variant="filled"
                      disabled={get(data, "createStation.data.id")}
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <TextField
                      fullWidth
                      label="State"
                      name="state"
                      onChange={handleChange}
                      required
                      value={values.state}
                      variant="filled"
                      disabled={get(data, "createStation.data.id")}
                    />
                  </Grid>
                  <Grid item md={4} xs={12}>
                    <TextField
                      fullWidth
                      label="Zip"
                      name="zip"
                      onChange={handleChange}
                      required
                      value={values.zip}
                      variant="filled"
                      disabled={get(data, "createStation.data.id")}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
            </Card>
          </Grid>
          <Grid item md={4} xs={12}>
            <Card>
              <CardHeader
                subheader="Add the address of Charging Center"
                title="Coordinates"
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Latitude"
                      name="latitude"
                      onChange={handleChange}
                      required
                      value={values.latitude}
                      variant="filled"
                      disabled={get(data, "createStation.data.id")}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Longitude"
                      name="longitude"
                      onChange={handleChange}
                      required
                      value={values.longitude}
                      variant="filled"
                      disabled={get(data, "createStation.data.id")}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Google Map Link"
                      name="maplink"
                      onChange={handleChange}
                      required
                      value={values.maplink}
                      variant="filled"
                      disabled={get(data, "createStation.data.id")}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={3}
          sx={{
            marginTop: "10px",
            position: "relative",
          }}
        >
          <Grid item md={5} xs={12}>
            <Card>
              <CardHeader
                subheader="Timings of your favourites to charge your vehicle"
                title="Select the time slot"
              />
              <Divider />
              <CardContent>
                <div>
                  <Grid>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      id="combo-box-demo"
                      options={timeSlots}
                      onChange={(event, newValue) =>
                        handleTimeSlotChange(newValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Time Slot"
                          variant="filled"
                        />
                      )}
                      disabled={get(data, "createStation.data.id")}
                      variant="filled"
                    />
                  </Grid>
                </div>
              </CardContent>
            </Card>
          </Grid>
          {/* <Grid item md={7} xs={12}>
            <Card>
              <CardHeader
                subheader="Add station contact person details "
                title="Contact Details"
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="conatctPerson"
                      onChange={handleChange}
                      required
                      value={values.conatctPerson}
                      variant="filled"
                      disabled={get(data, "createStation.data.id")}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      fullWidth
                      label="Number"
                      name="contactNumber"
                      onChange={handleChange}
                      required
                      value={values.contactNumber}
                      variant="filled"
                      disabled={get(data, "createStation.data.id")}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>*/}
        </Grid>

        <Card>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                p: 6,
              }}
            >
              <Button
                color="success"
                variant="contained"
                onClick={handleSubmit}
                disabled={get(data, "createStation.data.id") || isFieldsEmpty}
              >
                Create Station
              </Button>
            </Box>
          </CardContent>
        </Card>
      </form>
    </Box>
  );
};

export default WithCpoCtx(NewStation);
