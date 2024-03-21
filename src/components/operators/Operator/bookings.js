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
import { useRouter } from "next/router";
import Filters, { CPO, Stations, Status } from './utils/Filters';
import PerformanceBar from './utils/PerformaceBar';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Bookings from '../../bookings';
import { WithCpoCtx } from '../../../contexts/cpoContext';
import stationsQuery from '../../../graphQL/stations/getStations';
import allBookings from '../../../graphQL/bookings/allBookings';
import fetchPartners from 'src/graphQL/cpo/autoComplete';
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

const Booking = () => {
    const [value, setValue] = useState(0);
    const router = useRouter();
    const { id: name } = router.query;
    const [cpo, setCPO] = useState('');
    const [cpos, setCPOs] = useState([]);
    const [station, setStation] = useState('');
    const [stations, setStations] = useState([]);
    const [date, setDate] = useState('');
    const [open, setOpen] = React.useState(false);
    const [status, setStatus] = useState('');
    const [createdBefore, setCreatedBefore] = useState('');
    const [createdAfter, setCreatedAfter] = useState('');
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
                cpoId: name && name ? name : get(cpo, 'id', ''),
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
                    cpoId: name && name ? name : get(cpo, 'id', ''),
                    stationId: get(station, 'id', ''),
                    status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
                    createdBefore: createdBefore,
                    createdAfter: createdAfter
                },
                reserved: {
                    cpoId: name && name ? name : get(cpo, 'id', ''),
                    stationId: get(station, 'id', ''),
                    status: ['RESERVED'],
                    createdBefore: createdBefore,
                    createdAfter: createdAfter
                },
                hold: {
                    cpoId: name && name ? name : get(cpo, 'id', ''),
                    stationId: get(station, 'id', ''),
                    status: ['HOLD'],
                    createdBefore: createdBefore,
                    createdAfter: createdAfter
                },
                cancelled: {
                    cpoId: name && name ? name : get(cpo, 'id', ''),
                    stationId: get(station, 'id', ''),
                    status: ['CANCELED'],
                    createdBefore: createdBefore,
                    createdAfter: createdAfter
                },
                completed: {
                    cpoId: name && name ? name : get(cpo, 'id', ''),
                    stationId: get(station, 'id', ''),
                    status: ['COMPLETED'],
                    createdBefore: createdBefore,
                    createdAfter: createdAfter
                },
                running: {
                    cpoId: name && name ? name : get(cpo, 'id', ''),
                    stationId: get(station, 'id', ''),
                    status: ['RUNNING'],
                    createdBefore: createdBefore,
                    createdAfter: createdAfter
                }
            }
        }
    );

    useEffect(() => {
        if (name || cpo || station) {
            loadStations();
            loadBookingsCount();
        }
    }, [cpo, station, name]);

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


    let dates = new Date();

    // Use Date(year, month, day) function
    let t = (new Date(dates.getFullYear(), 12, 1));
    t.setHours(t.getHours() + 5);
    t.setMinutes(t.getMinutes() + 30);

    console.log(t.toISOString())

    let d = new Date();
    d.setHours(d.getHours() + 5);
    d.setMinutes(d.getMinutes() + 30);
    console.log(d.toISOString())

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
        if(date === 'Today'){
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

    return (
        <Grid container spacing={1} mt={1}>
            <Filters
                cpo={cpo}
                setCPO={setCPO}
                open={open}
                setOpen={setOpen}
                station={station}
                setStation={setStation}
                date={date}
                setDate={setDate}
            />
            <Grid item md={12}>
                <Card>
                    <CardHeader
                        sx={{ padding: '15px 20px 10px' }}
                        subheader="Filters"
                        action={
                            <Grid container>
                                {
                                    name && name ? ''
                                        : <CPO cpo={cpo} handleCpoChange={setCPO} allPartners={cpos} />
                                }

                                <Stations
                                    station={station}
                                    setStation={setStation}
                                    stations={stations}
                                />
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
                            </Grid>
                        }
                    />
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
                                label="RUNNING"
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
                                label="CANCELED"
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
                        cpoId={name && name ? name : get(cpo, 'id', '')}
                        stationId={get(station, 'id', '')}
                        createdBefore={createdBefore}
                        createdAfter={createdAfter}
                    />
                </Card>
            </Grid>
        </Grid>
    );
};

export default WithCpoCtx(Booking);
