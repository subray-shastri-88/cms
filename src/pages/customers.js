import React, { useState } from 'react';
import { Box, Container, Card, Grid, Typography } from '@mui/material';

import { DashboardLayout } from '../components/dashboard-layout';
import Users from '../components/users';
import TabPanel, { a11yProps } from '../components/ui/TabPanel';
import { useEffect } from 'react';
import compose from '../utils/compose';
import { auth } from '../utils/ssrUtils';

const CustomerManagement = () => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 2
      }}
    >
      <Container maxWidth="xl">
        <Card>
          <Typography sx={{ m: 3 }} variant="h4">
            Customer List
          </Typography>
        </Card>
        <Grid container spacing={3}>
          <Grid item md={12} xs={12}>
            <Box sx={{ marginTop: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Card>
                <Users kind={'PERSONAL'} />
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

CustomerManagement.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default CustomerManagement;
export const getServerSideProps = compose(auth);
