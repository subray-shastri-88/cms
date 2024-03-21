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
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import ErrorBox from "../ui/ErrorBox/ErrorBox";
import { emptyValueChecker } from "../../utils/jsUtils";
import { WithCpoCtx } from "../../contexts/cpoContext";
import userApis from "../../graphQL/users";
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

const NewCorpUser = ({
  kind,
  header,
  partnerOptionsEnabled = false,
  reload,
  resourceId = "",
}) => {
  const [open, setOpen] = useState(false);
  const { createUsers } = userApis;

  const defaultData = {
    role: "",
    name: "",
    phone: "",
    email: "",
    password: "",
  };

  const [createNewUser, { data, loading, error: err }] = useMutation(
    createUsers,
    {
      variables: {
        input: {
          email: "",
          phone: "",
          kind: "",
          name: "",
          password: "",
          role: "",
          resourceId: resourceId,
        },
      },
    }
  );

  const [userData, setUserData] = useState(defaultData);

  const [error, setError] = useState(false);

  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setUserData(defaultData);
    setOpen(false);
  };

  const onFormSubmit = () => {
    setError(false);
    const { userFor, ...rest } = userData;
    const checkIfEmpty = emptyValueChecker(rest);
    if (checkIfEmpty) {
      setError(true);
    } else {
      createNewUser({
        variables: {
          input: {
            email: userData.email,
            phone: userData.phone,
            kind,
            name: userData.name,
            password: userData.password,
            role: userData.role,
            resourceId,
          },
        },
      });
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "New user successfully added.",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  useEffect(() => {
    if (!loading && userData.name) {
      reload.fetch();
      handleClose();
      setUserData(defaultData);
    }
  }, [loading]);

  return (
    <React.Fragment>
      <Button
        color="primary"
        variant="contained"
        onClick={handleOpen}
        sx={{ position: "absolute", top: "25px", right: 30 }}
      >
        Add New User
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
          {error && <ErrorBox message="Please Enter all fields" />}
          <Card>
            <CardHeader subheader="Enter the User Details" title={header} />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Partner
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Partner"
                      name="partner"
                      onChange={handleChange}
                      value={
                        partnerOptionsEnabled ? userData.partner : resourceId
                      }
                      disabled={!partnerOptionsEnabled}
                    >
                      {!partnerOptionsEnabled && (
                        <MenuItem value={resourceId}>{resourceId}</MenuItem>
                      )}
                      <MenuItem value="BESCOM">BESCOM</MenuItem>
                      <MenuItem value="KSEM">KSEM</MenuItem>
                      <MenuItem value="MSEM">MSEM</MenuItem>
                      <MenuItem value="GESCOM">GESCOM</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item md={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      User Role
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Select Partner"
                      name="role"
                      onChange={handleChange}
                      value={userData.role}
                    >
                      <MenuItem value="OWNER">Owner</MenuItem>
                      <MenuItem value="MANAGER">Manager</MenuItem>
                      <MenuItem value="GUEST">Guest</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardHeader subheader="User Details" />
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
                    value={userData.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    onChange={handleChange}
                    required
                    value={userData.email}
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
                    value={userData.phone}
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
                    value={userData.password}
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

export default WithCpoCtx(NewCorpUser);
