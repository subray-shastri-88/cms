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
  Autocomplete,
} from "@mui/material";
import ErrorBox from "../ui/ErrorBox/ErrorBox";
import { useMutation } from "@apollo/client";
import { createVehicleManufacturer } from "../../graphQL/vehicle";
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

const NewManufacturer = () => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [name, setName] = useState("");

  const [createManufacturer, { data, loading, error }] = useMutation(
    createVehicleManufacturer,
    {
      variables: {
        name: null,
        type: null,
      },
    }
  );

  const handleOpen = () => {
    setOpen(true);
  };

  const refresh = () => {
    setName();
    setType();
  };

  const handleClose = () => {
    setOpen(false);
    refresh();
  };

  const onFormSubmit = () => {
    createManufacturer({
      variables: {
        name: name,
        type: type,
      },
    });
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "New vehicle manufacture successfully added.",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  useEffect(() => {
    if (data) {
      handleClose();
    }
  }, [data]);

  const vehiclesType = ["2W", "3W", "LMV", "HMV"];

  return (
    <React.Fragment>
      <Button
        color="primary"
        size="small"
        variant="contained"
        onClick={handleOpen}
      >
        New Manufacturer
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
            <CardHeader title="Add Vehicle Manufacturer" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    multiple
                    limitTags={3}
                    fullWidth
                    id="combo-box-demo"
                    options={vehiclesType}
                    onChange={(event, newValue) => setType(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Vehicle Manufacturing Types"
                      />
                    )}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    onChange={(e) => setName(e.target.value)}
                    required
                    value={name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3} xs={12}></Grid>
                <Grid item md={6} xs={12}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={onFormSubmit}
                    disabled={!name || !(type && type.length > 0)}
                    sx={{ width: "100%" }}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default NewManufacturer;
