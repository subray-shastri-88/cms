import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  CardHeader,
  Tabs,
  Button,
  Tab,
  Grid
} from '@mui/material';
import allBookings from '../graphQL/bookings/allBookings';
import stationsQuery from '../graphQL/stations/getStations';
import { useQuery, useLazyQuery } from '@apollo/client';
import { DashboardLayout } from '../components/dashboard-layout';
import Bookings from '../components/bookings';
import Booking from 'src/components/operators/Operator/bookings';
import TabPanel, { a11yProps } from '../components/ui/TabPanel';
import ScoreCard from '../components/ui/ScoreCard';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Filters, { CPO, Stations, Status } from '../components/operators/Operator/utils/Filters';
import PerformanceBar from '../components/operators/Operator/utils/PerformaceBar';
import {
  indigo,
  red,
  green,
  orange,
  blueGrey,
  lightBlue
} from '@mui/material/colors';
import compose from '../utils/compose';
import { auth } from '../utils/ssrUtils';

const BookingsManagement = ({ cpos }) => {
  const [cpo, setCPO] = useState('');
  const [status, setStatus] = useState('');
  const [value, setValue] = useState(0);
  const [bookingType, setBookingType] = useState('RUNNING');
  const [counts, setCounts] = useState({
    total: 0,
    hold: 0,
    cancelled: 0,
    reserved: 0,
    running: 0,
    completed: 0
  });

  const {
    loading,
    error,
    data: bookingCounts,
    refetch
  } = useQuery(allBookings, {
    variables: {
      pagination: {
        page: 0,
        limit: 1
      },
      all: {
        status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING']
      },
      reserved: {
        status: ['RESERVED']
      },
      hold: {
        status: ['HOLD']
      },
      cancelled: {
        status: ['CANCELED']
      },
      completed: {
        status: ['COMPLETED']
      },
      running: {
        status: ['RUNNING']
      }
    }
  });

  const onTabChange = (exp) => {
    let user = '';
    switch (exp) {
      case 1:
        user = 'RESERVED';
        break;
      case 2:
        user = 'HOLD';
        break;
      case 3:
        user = 'CANCELED';
        break;
      case 4:
        user = 'COMPLETED';
        break;
      default:
        user = 'RUNNING';
    }
    setBookingType(user);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onTabChange(newValue);
  };

  const BookingLists = ({ type }) => (
    <Card>
      <Bookings status={[type]} />
    </Card>
  );

  useEffect(() => {
    const running = get(bookingCounts, 'running.pagination.totalDocs', 0);
    const reserved = get(bookingCounts, 'reserved.pagination.totalDocs', 0);
    const cancelled = get(bookingCounts, 'cancelled.pagination.totalDocs', 0);
    const hold = get(bookingCounts, 'hold.pagination.totalDocs', 0);
    const completed = get(bookingCounts, 'completed.pagination.totalDocs', 0);
    const total = get(bookingCounts, 'all.pagination.totalDocs', 0);
    setCounts({
      running,
      reserved,
      cancelled,
      hold,
      completed,
      total
    });
  }, [bookingCounts]);
  
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 1
      }}
    >
      <Container maxWidth="xl">
      <Booking></Booking>
      </Container>
    </Box>
  );
};

BookingsManagement.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default BookingsManagement;

export const getServerSideProps = compose(auth);
