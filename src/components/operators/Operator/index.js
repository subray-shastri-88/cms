import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Tabs,
  Tab,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { get } from 'lodash';
import Filters, { CPO, Stations, Status } from './utils/Filters';
import PerformanceBar from './utils/PerformaceBar';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Bookings from '../../bookings';
import { WithCpoCtx } from '../../../contexts/cpoContext';
import stationsQuery from '../../../graphQL/stations/getStations';
import allBookings from '../../../graphQL/bookings/allBookings';
import getCPOs from '../../../graphQL/cpo/index';
import fetchPartners from 'src/graphQL/cpo/autoComplete';
import { useLazyQuery, useQuery } from '@apollo/client';
import ScoreCard from '../../ui/ScoreCard';
import {
  indigo,
  red,
  green,
  orange,
  blueGrey,
  lightBlue
} from '@mui/material/colors';

const TabPanel = ({ value, index, children }) => {
  return value === index ? children : '';
};

const Operator = () => {
  const [value, setValue] = useState(0);
  const [cpo, setCPO] = useState('');
  const [cpos, setCPOs] = useState([]);
  const [station, setStation] = useState('');
  const [stations, setStations] = useState([]);
  const [date, setDate] = useState('');
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = useState('');
  const [createdBefore, setCreatedBefore] = useState('');
  const [createdAfter, setCreatedAfter] = useState('');
  const [year, setYear] = useState();
  const [counts, setCounts] = useState({
    total: 0,
    hold: 0,
    cancelled: 0,
    reserved: 0,
    running: 0,
    completed: 0
  });

  function handleClick() {
    setLoading(true);
  }
  const handleChangeYear = (event) => {
    setYear(event.target.value);
  };

  useEffect(() => {
    if (year === undefined) {
      setYear('2024')
    }
  })


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const { loadCPOs, loadISOs, loadAllPartners } = fetchPartners;

  const [getAllCpo, { data: cpoList }] = useLazyQuery(
    loadCPOs,
    {
      variables: {
        pagination: {
          page: 1,
          limit: 100000
        }
      }
    }
  )

  useEffect(() => {
    getAllCpo();
    if (cpoList) {
      const list = get(cpoList, 'cpo.docs', []);
      let mappedData = list.map((item) => {
        return { label: item.name || '', name: item.name || '', ...item };
      });
      mappedData = mappedData.filter((item) => item.name);
      setCPOs(mappedData);
    }
  }, [cpoList]);


  const [loadStations, { data: stationsList }] = useLazyQuery(stationsQuery, {
    variables: {
      pagination: {
        page: 1,
        limit: 1000
      },
      filter: {
        cpoId: get(cpo, 'id', '')
      }
    }
  });

  const [loadBookingsCount, { data: bookingCounts }] = useLazyQuery(
    allBookings,
    {
      variables: {
        pagination: {
          page: 1,
          limit: 1000
        },
        all: {
          cpoId: get(cpo, 'id', ''),
          stationId: get(station, 'id', ''),
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: createdBefore,
          createdAfter: createdAfter

        },
        reserved: {
          cpoId: get(cpo, 'id', ''),
          stationId: get(station, 'id', ''),
          status: ['RESERVED'],
          createdBefore: createdBefore,
          createdAfter: createdAfter
        },
        hold: {
          cpoId: get(cpo, 'id', ''),
          stationId: get(station, 'id', ''),
          status: ['HOLD'],
          createdBefore: createdBefore,
          createdAfter: createdAfter
        },
        cancelled: {
          cpoId: get(cpo, 'id', ''),
          stationId: get(station, 'id', ''),
          status: ['CANCELED'],
          createdBefore: createdBefore,
          createdAfter: createdAfter
        },
        completed: {
          cpoId: get(cpo, 'id', ''),
          stationId: get(station, 'id', ''),
          status: ['COMPLETED'],
          createdBefore: createdBefore,
          createdAfter: createdAfter
        },
        running: {
          cpoId: get(cpo, 'id', ''),
          stationId: get(station, 'id', ''),
          status: ['RUNNING'],
          createdBefore: createdBefore,
          createdAfter: createdAfter
        }
      }
    }
  );

  useEffect(() => {
    if (cpo || station) {
      loadStations();
      loadBookingsCount();
    }
  }, [cpo, station]);

  useEffect(() => {
    loadBookingsCount();
  }, []);

  useEffect(() => {
    const running = get(bookingCounts, 'running.pagination.totalDocs', 0);
    const reserved = get(bookingCounts, 'reserved.pagination.totalDocs', 0);
    const cancelled = get(bookingCounts, 'cancelled.pagination.totalDocs', 0);
    const hold = get(bookingCounts, 'hold.pagination.totalDocs', 0);
    const completed = get(bookingCounts, 'completed.pagination.totalDocs', 0);
    const total = running + reserved + cancelled + hold + completed;
    setCounts({
      running,
      reserved,
      cancelled,
      hold,
      completed,
      total
    });
  }, [bookingCounts]);

  useEffect(() => {
    if (stationsList) {
      const list = get(stationsList, 'Stations.docs', []);
      let mappedData = list.map((item) => {
        return { label: item.name || '', name: item.name || '', ...item };
      });
      mappedData = mappedData.filter((item) => item.name);
      setStations(mappedData);
    }
  }, [stationsList]);

  const defaultStatus = [
    'RESERVED',
    'HOLD',
    'CANCELED',
    'COMPLETED',
    'RUNNING'
  ];

  const statusFilter = status ? [status] : defaultStatus;

  let d = new Date();

  let lastSevenDays = (d.getUTCDate() - 7).toString();

  if (d.getUTCDate() - 7 == 0) {
    return lastSevenDays = '01';
  }

  const lastSeven = `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, '0')}-${lastSevenDays.padStart(2, '0')}T00:00:00.000Z`;
  const today = `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, '0')}-${d.getUTCDate().toString().padStart(2, '0')}T00:00:00.000Z`;
  const lastMonthFirst = `${d.getUTCFullYear()}-${(d.getUTCMonth()).toString().padStart(2, '0')}-01T00:00:00.000Z`;
  const lastMonthLast = `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, '0')}-01T00:00:00.000Z`;
  const thisMonthLast = `${d.getUTCFullYear()}-${(d.getUTCMonth() + 2).toString().padStart(2, '0')}-01T00:00:00.000Z`;
  const todayDate = d.toISOString();

  useEffect(() => {

    if (date === 'Today') {
      setCreatedAfter(today);
      setCreatedBefore(todayDate);
    }

    if (date === 'Last 7 days') {
      setCreatedAfter(lastSeven);
      setCreatedBefore(todayDate);
    }
    if (date === 'Last Month') {
      setCreatedAfter(lastMonthFirst);
      setCreatedBefore(lastMonthLast);
    }
    if (date === 'This Months') {
      setCreatedAfter(lastMonthLast);
      setCreatedBefore(thisMonthLast);
    }

  }, [date])

console.log(cpos , 'cpos')
console.log(cpo , 'cpo')
  return (
    <Grid container spacing={1}>
      {/* <Filters
        cpo={cpo}
        setCPO={setCPO}
        open={open}
        setOpen={setOpen}
        station={station}
        setStation={setStation}
        date={date}
        setDate={setDate}
      /> */}
      <Grid item md={12}>
        <Card>
          <CardHeader
            sx={{ padding: '15px 20px 10px' }}
            subheader="Filters"
            action={
              <Grid container>
                <CPO cpo={cpo} handleCpoChange={setCPO} allPartners={cpos} />
                <Stations
                  station={station}
                  setStation={setStation}
                  stations={stations}
                />

                {
                  value === 0 && (
                    <FormControl sx={{ width: '250px', marginX: '2px' }}>
                      <InputLabel id="demo-simple-select-label">Year</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        size='small'
                        defaultValue={'2024'}
                        value={year}
                        label="Year"
                        onChange={handleChangeYear}
                      >
                        <MenuItem value={'2024'}>2024</MenuItem>
                        <MenuItem value={'2023'}>2023</MenuItem>
                        <MenuItem value={'2022'}>2022</MenuItem>
                        <MenuItem value={'2021'}>2021</MenuItem>
                        <MenuItem value={'2020'}>2020</MenuItem>
                        <MenuItem value={'2019'}>2019</MenuItem>
                        <MenuItem value={'2018'}>2018</MenuItem>
                        <MenuItem value={'2017'}>2017</MenuItem>
                        <MenuItem value={'2016'}>2016</MenuItem>
                        <MenuItem value={'2015'}>2015</MenuItem>
                      </Select>
                    </FormControl>
                  )
                }


                {value === 1 && (
                  <>
                    <Status
                      statusList={defaultStatus}
                      status={status}
                      setStatus={setStatus}
                      label='Booking Status'
                    />
                    <Button
                      endIcon={<ArrowDropDownIcon fontSize="small" />}
                      size="small"
                      onClick={handleClickOpen}
                      sx={{ marginX: '1px' }}
                    >
                      Date : {date || 'Select Date'}
                    </Button>
                  </>
                )}

              </Grid>
            }
          />
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{ marginBottom: '10px' }}
          >
            <Tab label="Metrics" />
            <Tab label="Bookings" />
            {/* <Tab label="Revenue Model" disabled={!cpo} />
            <Tab label="Machines" disabled={!cpo || !station} /> */}
          </Tabs>
          <TabPanel value={value} index={0}>
            <PerformanceBar
              cpoId={get(cpo, 'id', '')}
              stationId={get(station, 'id', '')}
              year={year}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Grid container spacing={3} sx={{ padding: '20px' }}>
              <Grid item xl={2} mds={2} sm={6} xs={12}>
                <ScoreCard
                  label="TOTAL"
                  count={counts.total}
                  color={indigo[700]}
                />
              </Grid>
              <Grid item xl={2} mds={2} sm={6} xs={12}>
                <ScoreCard
                  label="ONGOING"
                  count={counts.running}
                  color={green[700]}
                />
              </Grid>
              <Grid item xl={2} mds={2} sm={6} xs={12}>
                <ScoreCard
                  label="RESERVED"
                  count={counts.reserved}
                  color={orange[700]}
                />
              </Grid>
              <Grid item xl={2} mds={2} sm={6} xs={12}>
                <ScoreCard
                  label="HOLD"
                  count={counts.hold}
                  color={blueGrey[700]}
                />
              </Grid>
              <Grid item xl={2} mds={2} sm={6} xs={12}>
                <ScoreCard
                  label="CANCELLED"
                  count={counts.cancelled}
                  color={red[700]}
                />
              </Grid>
              <Grid item xl={2} mds={2} sm={6} xs={12}>
                <ScoreCard
                  label="COMPLETED"
                  count={counts.completed}
                  color={lightBlue[700]}
                />
              </Grid>
            </Grid>
            <Bookings
              status={statusFilter}
              cpoId={get(cpo, 'id', '')}
              stationId={get(station, 'id', '')}
              createdBefore={createdBefore}
              createdAfter={createdAfter}
            />
          </TabPanel>
        </Card>
      </Grid>
    </Grid>
  );
};

export default WithCpoCtx(Operator);
