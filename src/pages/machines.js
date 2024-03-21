import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Tabs, Tab } from '@mui/material';
import { WithCpoCtx } from '../contexts/cpoContext';
import { DashboardLayout } from '../components/dashboard-layout';
import TabPanel, { a11yProps } from '../components/ui/TabPanel';
import compose from '../utils/compose';
import { auth } from '../utils/ssrUtils';
import PlugManagement from '../components/machines/Plugs';
import MakeAndModel from '../components/machines/MakeAndModel';

const FullWidthTabs = ({ loadAllCpos, allPartners }) => {
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
          <Tabs
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
            <Tab label="Plugs" {...a11yProps(0)} />
            <Tab label="Machines" {...a11yProps(1)} />
            {/* <Tab label="Chargers" {...a11yProps(1)} /> */}
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <PlugManagement />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <MakeAndModel allPartners={allPartners} />
        </TabPanel>
      </Container>
    </Box>
  );
};

const Stations = WithCpoCtx(FullWidthTabs);

Stations.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Stations;
export const getServerSideProps = compose(auth);
