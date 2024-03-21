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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Ring from "../ui/Loader/Ring";
import ErrorBox from "../ui/ErrorBox/ErrorBox";
import { emptyValueChecker } from "../../utils/jsUtils";
import { createDriver } from "../../graphQL/corporate";
import { useMutation, error } from "@apollo/client";
import { WithCpoCtx } from "../../contexts/cpoContext";
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

const NewDriver = ({ header, corporate, fetch }) => {
  const [open, setOpen] = useState(false);
  const defaultData = {
    name: "",
    phone: "",
    email: "",
    password: "",
    status: "ACTIVE",
  };

  const [createNewDriver, { data, loading, error: err }] = useMutation(
    createDriver,
    {
      variables: {
        corporateId: null,
        input: {
          email: null,
          phone: null,
          name: null,
          password: null,
          status: "ACTIVE",
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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setPartnerData(defaultData);
    setOpen(false);
  };

  

  const onFormSubmit = () => {
    setError(false);
    const checkIfEmpty = emptyValueChecker(partnerData);
    if (checkIfEmpty) {
      setError(true);
    } else {
      createNewDriver({
        variables: {
          corporateId: corporate.id,
          input: {
            name: partnerData.name,
            phone: partnerData.phone,
            email: partnerData.email,
            password: partnerData.password,
            status: partnerData.status,
          },
        },
      })
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "You have successfully added your driver.",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            onClose: handleClose,
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Something went wrong. Please try again.",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        });
    }
  };

  useEffect(() => {
    fetch();
    if (data) {
      handleClose();
      setPartnerData(defaultData);
    }
  }, [data, loading, err]);

  return (
    <React.Fragment>
      <Button
        color="primary"
        variant="contained"
        onClick={handleOpen}
        sx={{ position: "absolute", top: "25px", right: 30 }}
      >
        Add New Driver
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
          {err && <ErrorBox message="Something Went Wrong" />}
          {loading && <Ring />}
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
                  <TextField
                    fullWidth
                    label="Phone"
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
                    label="Corporate Name"
                    name="name"
                    required
                    value={corporate.name}
                    variant="outlined"
                    disabled
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Status
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Status"
                      name="status"
                      onChange={handleChange}
                      value={partnerData.status}
                      defaultValue="ACTIVE"
                    >
                      <MenuItem value={"ACTIVE"}>Active</MenuItem>
                      <MenuItem value={"IN_ACTIVE"}>In Active</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardHeader subheader="Login Details" />
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
                    label="Password"
                    name="password"
                    onChange={handleChange}
                    required
                    value={partnerData.password}
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
          >
            SUBMIT
          </Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default WithCpoCtx(NewDriver);
