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
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import Ring from "../../../ui/Loader/Ring";
import ErrorBox from "../../../ui/ErrorBox/ErrorBox";
import { emptyValueChecker } from "../../../../utils/jsUtils";
import createCPO from "../../../../graphQL/cpo/createCpo";
import { useMutation } from "@apollo/client";
import { WithCpoCtx } from "../../../../contexts/cpoContext";
import Swal from "sweetalert2";
// import { useMutation } from "@apollo/client";
// import { updateOperatorMutation } from "./yourGraphQLModule"; // Import your GraphQL mutation

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

const NewOperatorModal = ({
  defaultType,
  header,
  loadCpoList,
  loadIsoList,
}) => {
  const [open, setOpen] = useState(false);
  const defaultData = {
    name: "",
    type: defaultType,
    city: "",
    line1: "",
    line2: "",
    state: "",
    zip: "",
    phone: "",
    gst: "",
    pan: "",
    accountNumber: "",
    ifsc: "",
  };

  // useEffect(() => {
  //   setEditedOperator(operator || {});
  // }, [operator]);

  const [createNewCPO, { data, loading, error: mutationError }] =
    useMutation(createCPO);

  const [partnerData, setPartnerData] = useState(defaultData);
  const [hasError, setHasError] = useState(false);

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
    setHasError(false);
  };

  const onFormSubmit = async () => {
    setHasError(false);
    const checkIfEmpty = emptyValueChecker(partnerData);
    if (checkIfEmpty) {
      setHasError(true);
    } else {
      try {
        await createNewCPO({
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
              billing: {
                gst: partnerData.gst,
                pan: partnerData.pan,
                accountNumber: partnerData.accountNumber,
                ifsc: partnerData.ifsc,
              },
              kind: defaultType,
              name: partnerData.name,
              phone: partnerData.phone,
            },
          },
        });
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "New operator successfully added.",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        handleClose();
      } catch (error) {
        console.error("Error creating new operator:", error);
      }
    }
  };

  useEffect(() => {
    if (data || mutationError) {
      handleClose();
      setPartnerData(defaultData);
      defaultType === "ISO" ? loadIsoList() : loadCpoList();
    }
  }, [data, mutationError]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box
        sx={{
          ...style,
        }}
      >
        {mutationError && <ErrorBox message="Something Went Wrong" />}
        {loading && <Ring />}
        {hasError && <ErrorBox message="Please Enter all fields" />}
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
              <Grid item md={6} xs={12}>
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
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Zip"
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
                  label="Phone"
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
                  label="Account Number"
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

        <Divider />
        <Button
          color="primary"
          variant="contained"
          sx={{ marginTop: 3, float: "right" }}
          onClick={onFormSubmit}
        >
          Update
        </Button>
      </Box>
    </Modal>
  );
};

export default NewOperatorModal;

