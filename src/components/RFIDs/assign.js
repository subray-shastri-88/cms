import React, { useState, useEffect } from 'react';
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
  Autocomplete
} from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

import ErrorBox from '../ui/ErrorBox/ErrorBox';
import { emptyValueChecker } from '../../utils/jsUtils';
import { WithCpoCtx } from '../../contexts/cpoContext';
import userApis from '../../graphQL/users';
import { useLazyQuery, useMutation } from '@apollo/client';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: '3px',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3
};

const AssignRFID = ({ header, allPartners, loadAllCpos }) => {
  const [open, setOpen] = useState(false);
  const [cpo, setCPO] = useState();
  const [rfid, setRfid] = useState('');
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const { createRFID, getUser } = userApis;

  const [addRfId, { data, loading, error: err }] = useMutation(createRFID, {
    variables: {
      input: {
        idTag: null,
        cpoId: null,
        userId: null
      }
    }
  });

  const [getUserData, { data: user, loading: userLoading }] = useLazyQuery(
    getUser,
    {
      variables: {
        userId: query
      }
    }
  );

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onFormSubmit = () => {
    setError(false);
    const checkIfEmpty = emptyValueChecker(userData);
    if (checkIfEmpty) {
      setError(true);
    } else {
      addRfId({
        input: {
          idTag: rfid,
          cpoId: cpo.id,
          userId: null
        }
      });
      handleClose();
    }
  };

  const handleCpoChange = (value) => {
    setCPO(value);
  };

  useEffect(() => {
    loadAllCpos;
    if (query) {
      getUserData();
    }
  }, [query]);

  useEffect(() => {
    loadAllCpos();
  }, []);

  return (
    <React.Fragment>
      <Button
        color="primary"
        variant="contained"
        onClick={handleOpen}
        sx={{ position: 'absolute', top: '25px', right: 30 }}
      >
        Add New RFID
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
            width: '900px',
            maxHeight: '900px',
            overflowY: 'scroll'
          }}
        >
          {error && <ErrorBox message="Please Enter all fields" />}
          <Card>
            <CardHeader subheader="Assignment Details" title={header} />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    fullWidth
                    id="combo-box-demo"
                    options={allPartners || []}
                    onChange={(event, newValue) => handleCpoChange(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Partner" />
                    )}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="RFID"
                    name="rfid"
                    onChange={(e) => setRfid(e.target.value)}
                    required
                    value={rfid}
                    variant="outlined"
                  />
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
                    label="User Mobile/Email"
                    onChange={handleChange}
                    required
                    value={query}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Button
                    color="primary"
                    variant="contained"
                    sx={{ marginTop: 3, float: 'right' }}
                    onClick={onFormSubmit}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardHeader subheader="Login Details" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}></Grid>
              </Grid>
            </CardContent>
          </Card>

          <Divider />
          <Button
            color="primary"
            variant="contained"
            sx={{ marginTop: 3, float: 'right' }}
            onClick={onFormSubmit}
          >
            ASSIGN
          </Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default WithCpoCtx(AssignRFID);
