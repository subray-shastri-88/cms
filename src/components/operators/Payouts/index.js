import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import { get } from 'lodash';
import Filters, { CPO, Stations, Status } from '../Operator/utils/Filters';
import PerformanceBar from '../Operator/utils/PerformaceBar';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Bookings from '../../bookings';
import { WithCpoCtx } from '../../../contexts/cpoContext';
import stationsQuery from '../../../graphQL/stations/getStations';
import allBookings from '../../../graphQL/bookings/allBookings';
import { useLazyQuery } from '@apollo/client';
import ScoreCard from '../../ui/ScoreCard';
import {
  indigo,
  red,
  green,
  orange,
  blueGrey,
  lightBlue
} from '@mui/material/colors';
import Billing from '../../transactions/billings';
import PayOuts from '../../transactions/payout';

const TabPanel = ({ value, index, children }) => {
  return value === index ? children : '';
};

const Payouts = ({ cpos }) => {
  const [value, setValue] = useState(0);
  const [cpo, setCPO] = useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={1}>
      <Grid item md={12}>
        <Card>
          <CardHeader
            sx={{ padding: '15px 20px 10px' }}
            subheader="Filters"
            action={
              <Grid container>
                <CPO cpo={cpo} handleCpoChange={setCPO} allPartners={cpos} />
              </Grid>
            }
          />
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{ marginBottom: '10px' }}
          >
            <Tab label="List" />
            <Tab label="Create New" disabled={!cpo.id} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <Billing cpoId={cpo.id} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <PayOuts cpoId={cpo.id} />
          </TabPanel>
        </Card>
      </Grid>
    </Grid>
  );
};

export default WithCpoCtx(Payouts);
