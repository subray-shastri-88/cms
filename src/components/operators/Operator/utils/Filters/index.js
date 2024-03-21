import React, { useState , useEffect } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Autocomplete,
  CardHeader,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import getBookings from "../../../../../graphQL/bookings";
import { useQuery } from '@apollo/client';

const StaticDatePickerLandscape = ({ label, disabled }) => {
  const [value, setValue] = React.useState(new Date());

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label={label}
        value={value}
        minDate={new Date('2021-01-01')}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(params) => <TextField {...params} />}
        disabled={disabled}
      />
    </LocalizationProvider>
  );
};

const SelectCPO = ({ open, setOpen, date, setDate }) => {

  const [value, setValue] = useState(date);
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  const onConfirm = () => {
    setDate(value);
    handleClose();
  };

  return (
    <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
      <DialogTitle>Date Filter</DialogTitle>
      <DialogContent sx={{ paddingTop: '20px !important' }}>
        <Grid container spacing={3}>
          <Grid item md={12}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Range</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value}
                label="Range"
                onChange={handleChange}
              >
                <MenuItem value={'Today'}>Today</MenuItem>
                <MenuItem value={'Last 7 days'}>Last 7 days</MenuItem>
                <MenuItem value={'Last Month'}>Last Month</MenuItem>
                <MenuItem value={'This Months'}>This Month</MenuItem>
              </Select>
             </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onConfirm}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};

const CPO = ({ cpo, handleCpoChange, allPartners }) => {
  const handleChange = (event, newValue) => {
    handleCpoChange(newValue);
  };

  return (
    <Autocomplete
      value={cpo}
      id="size-small-standard"
      size="small"
      onChange={handleChange}
      options={allPartners}
      renderInput={(params) => (
        <TextField size="small" {...params} label="CPO" />
      )}
      sx={{ width: '250px', marginX: '2px' }}
    />
  );
};

const Status = ({ statusList, status, setStatus , label }) => {
  const handleChange = (event, newValue) => {
    setStatus(newValue);
  };

  return (
    <Autocomplete
      value={status}
      id="size-small-standard"
      size="small"
      onChange={handleChange}
      options={statusList}
      renderInput={(params) => (
        <TextField size="small" {...params} label={label} />
      )}
      sx={{ width: '250px', marginX: '2px' }}
    />
  );
};

const Stations = ({ station, setStation, stations }) => {
  const handleChange = (event, newValue) => {
    setStation(newValue);
  };

  return (
    <Autocomplete
      value={station}
      id="size-small-standard"
      size="small"
      onChange={handleChange}
      options={stations}
      renderInput={(params) => (
        <TextField size="small" {...params} label="Stations" />
      )}
      sx={{ width: '250px', marginX: '2px' }}
    />
  );
};

const StateList = ({ state, handleStateChange, allStates }) => {
  const handleChange = (event, newValue) => {
      handleStateChange(newValue);
  };

  return (
      <Autocomplete
          value={state}
          id="size-small-standard"
          size="small"
          fullWidth
          onChange={handleChange}
          options={allStates}
          renderInput={(params) => (
              <TextField fullWidth {...params} label="State" required />
          )}
          sx={{ width: '250px', marginX: '2px' }}
      />
  );
};

export default SelectCPO;

export { CPO, Stations, Status , StateList};


