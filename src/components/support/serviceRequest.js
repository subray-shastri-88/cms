import React, { useState, useEffect } from 'react';
import {
    Grid,
    Card,
    CardHeader,
} from '@mui/material';
import { get } from 'lodash';
import Filters, { Status } from '../operators/Operator/utils/Filters';
import { WithCpoCtx } from '../../contexts/cpoContext';
import allServices from 'src/graphQL/support/allServices';
import { useLazyQuery } from '@apollo/client';
import ScoreCard from '../ui/ScoreCard';
import Services from './';
import {
    indigo,
    red,
    green,
    orange,
    blueGrey,
    lightBlue
} from '@mui/material/colors';

const Service = () => {
    const [status, setStatus] = useState('');
    const [type , setType] = useState('');
    const [counts, setCounts] = useState({
        total: 0,
        hold: 0,
        cancelled: 0,
        reserved: 0,
        running: 0,
        completed: 0
    });

    const [loadCount, { data: count }] = useLazyQuery(
        allServices,
        {
            variables: {
                pagination: {
                    page: 1,
                    limit: 1000000
                },

                PENDING: {
                    status: 'PENDING',
                },
                OPENED: {
                    status: 'OPENED',
                },
                ASSIGNED: {
                    status: 'ASSIGNED',
                },
                INPROCESS: {
                    status: 'INPROCESS',
                },
                CLOSED: {
                    status: 'CLOSED',
                }
            }
        }
    );

    useEffect(() => {
        loadCount();
    },[]);

    useEffect(() => {
        const inprocess = get(count, 'INPROCESS.pagination.totalDocs', 0);
        const opened = get(count, 'OPENED.pagination.totalDocs', 0);
        const closed = get(count, 'CLOSED.pagination.totalDocs', 0);
        const pending = get(count, 'PENDING.pagination.totalDocs', 0);
        const assigned = get(count, 'ASSIGNED.pagination.totalDocs', 0);
        const total = inprocess + opened + closed + pending + assigned;
        setCounts({
            inprocess,
            opened,
            closed,
            pending,
            assigned,
            total
        });
    }, [count]);

    const defaultStatus = [
        'PENDING',
        'OPENED',
        'ASSIGNED',
        'INPROCESS',
        'CLOSED'
    ];

    const requestType = [
       'Wallet',
       'Charging',
       'Profile',
       'Stations'
    ];

    const statusFilter = status ? status : null;
    const typeFilter = type ? type : null;

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
                                <Status
                                    statusList={defaultStatus}
                                    status={status}
                                    setStatus={setStatus}
                                    label='Status'
                                />
                                <Status
                                    statusList={requestType}
                                    status={type}
                                    setStatus={setType}
                                    label='Type'
                                />
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
                                label="PENDING"
                                count={counts.pending}
                                color={green[700]}
                            />
                        </Grid>
                        <Grid item xl={2} mds={2} sm={6} xs={12}>
                            <ScoreCard
                                label="OPENED"
                                count={counts.opened}
                                color={orange[700]}
                            />
                        </Grid>
                        <Grid item xl={2} mds={2} sm={6} xs={12}>
                            <ScoreCard
                                label="ASSIGNED"
                                count={counts.assigned}
                                color={blueGrey[700]}
                            />
                        </Grid>
                        <Grid item xl={2} mds={2} sm={6} xs={12}>
                            <ScoreCard
                                label="INPROCESS"
                                count={counts.inprocess}
                                color={red[700]}
                            />
                        </Grid>
                        <Grid item xl={2} mds={2} sm={6} xs={12}>
                            <ScoreCard
                                label="CLOSED"
                                count={counts.closed}
                                color={lightBlue[700]}
                            />
                        </Grid>
                    </Grid>
                    <Services
                        status={statusFilter}
                        type={typeFilter}
                    />
                </Card>
            </Grid>
        </Grid>
    );
};

export default WithCpoCtx(Service);
