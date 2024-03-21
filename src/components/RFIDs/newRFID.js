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
import { CreateRfId } from '../../graphQL/rfid';
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

const AssignRFID = ({ header, loadData, allPartners, loadAllCpos }) => {
  const [open, setOpen] = useState(false);
  const [cpo, setCPO] = useState();
  const [rfId, setRfId] = useState('');
  const [error, setError] = useState(false);
  const { createRfIds, createRfIdResponse } = CreateRfId();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onFormSubmit = () => {
    createRfIds({ cpoId: cpo.id, idTag: rfId });
  };

  const handleCpoChange = (value) => {
    setCPO(value);
  };

  useEffect(() => {
    if (createRfIdResponse) {
      setOpen(false);
      loadData();
    }
  }, [createRfIdResponse]);

  useEffect(() => {
    loadAllCpos();
  }, []);

  console.log(allPartners , 'cpo')

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
                    onChange={(e) => setRfId(e.target.value)}
                    required
                    value={rfId}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Button
            color="primary"
            variant="contained"
            sx={{ marginTop: 3, float: 'right' }}
            onClick={onFormSubmit}
            disabled={!(cpo?.id && rfId)}
          >
            Assign to CPO
          </Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default WithCpoCtx(AssignRFID);
