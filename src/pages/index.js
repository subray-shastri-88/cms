import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { Budget } from '../components/dashboard/budget';
import { Sales } from '../components/dashboard/sales';
import { TotalStations } from '../components/dashboard/tasks-progress';
import { TotalCustomers } from '../components/dashboard/total-customers';
import { TotalProfit } from '../components/dashboard/total-profit';
import { DashboardLayout } from '../components/dashboard-layout';
import getBookings from '../graphQL/bookings';
import compose from '../utils/compose';
import { auth } from '../utils/ssrUtils';
import {
  CPOCOUNT,
  ISOCOUNT,
  CORPCOUNT,
  FLEETDRIVERS
} from '../components/dashboard/counts';
import { get } from 'lodash';
import stationsQuery from '../graphQL/stations';
import userApis from "../graphQL/users";
import fetchPartners from 'src/graphQL/cpo/autoComplete';
import { corporatesList } from '../graphQL/corporate/index';
import { useLazyQuery, useQuery } from '@apollo/client';
import { round } from 'lodash';
import { useRouter } from "next/router";
import { clearAllData } from 'src/utils/jsUtils';

const Dashboard = ({ cpoId, stationId }) => {
  const [userList, setUserList] = useState('');
  const [cpoList, setCpoList] = useState('');
  const [isoList, setIsoList] = useState('');
  const [corpList, setCorpList] = useState('');
  const [driverList, setDriverList] = useState('');
  const [counts, setCounts] = useState({
    booking: 0,
    powerConsumed: 0,
    powerCost: 0,
    revenue: 0,
    totalStations: 0,
    unBilledAmount: 0
  });
  const { ReservationAnalytics } = stationsQuery;
  const router = useRouter();
  useEffect(() =>{
    if(sessionStorage.getItem('kind') === 'CPO' || sessionStorage.getItem('kind') === 'CORP'){
      clearAllData();
      router.push("/login");
    }
  },[])

  const [loadAnalytics, { data: analyticsData }] = useLazyQuery(
    ReservationAnalytics,
    {
      variables: {
        filter: {
          cpoId: "",
          stationId: ""
        }
      }
    }
  );
  const { getUsers, ToggleUserStatus } = userApis;
  const { loadCPOs, loadISOs, loadAllPartners } = fetchPartners;
  const [getAllUsers, { data: users }] = useLazyQuery(
    getUsers,
    {
      variables: {
        pagination: {
          page: 1,
          limit: 100000
        },
        filter: {
          kind: ["ADMIN", "CPO", "CORP", "DRIVER", "END_USER"]
        }
      }
    }
  )

  const [getAllIso, { data: iso }] = useLazyQuery(
    loadISOs,
    {
      variables: {
        pagination: {
          page: 1,
          limit: 100000
        }
      }
    }
  )

  const [getAllCpo, { data: cpo }] = useLazyQuery(
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

  const [getAllCorp, { data: corp }] = useLazyQuery(
    corporatesList,
    {
      variables: {
        pagination: {
          page: 1,
          limit: 100000
        },
      }
    }
  )

  const [getAllDriver, { data: driver }] = useLazyQuery(
    getUsers,
    {
      variables: {
        pagination: {
          page: 1,
          limit: 100000
        },
        filter: {
          kind: ["DRIVER"]
        }
      }
    }
  )


  useEffect(() => {
    if (!cpoId) {
      loadAnalytics();
    }
  }, [cpoId, stationId]);

  const removeNull = (data, key) => {
    const value = get(data, `${key}`, 0);
    const filteredValue = value !== null ? value : 0;
    return filteredValue;
  };

  // useEffect(() => {
  //   let lists = get(data, "Users.pagination.totalDocs", "");
  //   setUserList(lists);
  // }, [loading, error, data]);
  useEffect(() => {
    getAllUsers();
    getAllCpo();
    getAllIso();
    getAllCorp();
    getAllDriver();
    let lists = get(users, "Users.pagination.totalDocs", "");
    let cpolists = get(cpo, "cpo.pagination.totalDocs", "");
    let isolists = get(cpo, "iso.pagination.totalDocs", "");
    let corplists = get(corp, "Corporates.pagination.totalDocs", "");
    let driverlists = get(driver, "Users.pagination.totalDocs", "");
    setUserList(lists);
    setCpoList(cpolists);
    setIsoList(isolists);
    setCorpList(corplists);
    setDriverList(driverlists)
  }, [users , cpo , corp , driver])

  useEffect(() => {
    const booking = removeNull(analyticsData, 'ReservationAnalytics.booking');
    const powerConsumed = removeNull(
      analyticsData,
      'ReservationAnalytics.powerConsumed'
    );
    const revenue = removeNull(analyticsData, 'ReservationAnalytics.revenue');
    const totalStations = removeNull(
      analyticsData,
      'ReservationAnalytics.totalStations'
    );

    setCounts({
      booking,
      powerConsumed,
      revenue,
      totalStations
    });
  }, [analyticsData]);
  let total_revenue = round(counts.revenue, 2) || 0;
  let total_stations = counts.totalStations;
  let total_units = round(counts.powerConsumed, 2) || 0;
  return (
    <>
      <Head>
        <title>QuikPlugs</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item xl={3} mds={3} sm={6} xs={12}>
              <TotalCustomers user={userList} />
            </Grid>
            <Grid item xl={3} mds={3} sm={6} xs={12}>
              <TotalStations station={total_stations} />
            </Grid>
            <Grid item mds={3} sm={6} xl={3} xs={12}>
              <Budget revenue={total_revenue} />
            </Grid>
            <Grid item xl={3} mds={3} sm={6} xs={12}>
              <TotalProfit sx={{ height: '100%' }} units={total_units} />
            </Grid>
            <Grid item lg={10} md={12} xl={9} xs={12}>
              <Sales sx={{ height: '100%' }} />
            </Grid>
            <Grid item lg={2} md={6} xl={3} xs={12}>
              <Grid container spacing={3}>
                <Grid item lg={12} md={12} xl={9} xs={12}>
                  <CPOCOUNT cpo={cpoList} />
                </Grid>
                <Grid item lg={12} md={12} xl={9} xs={12}>
                  <ISOCOUNT iso={isoList} />
                </Grid>
                <Grid item lg={12} md={12} xl={9} xs={12}>
                  <CORPCOUNT corp={corpList} />
                </Grid>
                <Grid item lg={12} md={12} xl={9} xs={12}>
                  <FLEETDRIVERS drivers={driverList} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;

export const getServerSideProps = compose(auth);
