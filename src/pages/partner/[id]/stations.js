import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Container, Grid, Typography, Tabs, Tab } from '@mui/material';
import { WithCpoCtx } from '../../../contexts/cpoContext';
import { DashboardLayout } from "../../../components/dashboard-layout";
import compose from '../../../utils/compose';
import { auth } from '../../../utils/ssrUtils';
import Listings from 'src/components/stations/Listing/cpoStation';

const StationForm = () => (
  <>
    <Head>
      <title> Charging Stations </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 2
      }}
    >
      <Container maxWidth="xl" sx={{ px: 0 }}>
        <Typography sx={{ mb: 3 }} variant="h4">
          Onboard New Station
        </Typography>
        {/* <Grid container spacing={3}>
          <Grid item lg={12} md={12} xs={12}>
            <NewStation />
          </Grid>
        </Grid> */}
      </Container>
    </Box>
  </>
);

const FullWidthTabs = ({ loadAllCpos }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    loadAllCpos();
  }, []);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 3
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          {/* <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            indicatorColor="secondary"
            textColor="secondary"
            sx={{
              backgroundColor: '#fff',
              margin: '0 25px',
              borderRadius: '8px'
            }}
          >
            <Tab label="Stations List" {...a11yProps(0)} />
            <Tab label="Map" {...a11yProps(1)} />
            <Tab label="Overview" {...a11yProps(2)} />
          </Tabs>*/}
          <Listings />
        </Box>
        {/*<TabPanel value={value} index={0}>
          <Listings />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <StationMap />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Analysis />
        </TabPanel> */}
      </Container>
    </Box>
  );
};

const Stations = WithCpoCtx(FullWidthTabs);

Stations.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Stations;
export const getServerSideProps = compose(auth);
