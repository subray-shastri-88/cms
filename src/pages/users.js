import React, { useState } from 'react';
import { get } from 'lodash';
import {
  Box,
  Container,
  Card,
  Typography,
  Grid,
  Tabs,
  Tab
} from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';
import Users from '../components/users';
import NewUser from '../components/addNewPartner/user';
import compose from '../utils/compose';
import { auth } from '../utils/ssrUtils';
import { corporatesList } from '../graphQL/corporate';
import { WithCpoCtx } from '../contexts/cpoContext';
import { useQuery } from '@apollo/client';


const FullWidthTabs = ({ cpos }) => {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { data: corpData } = useQuery(corporatesList, {
    variables: {
      pagination: {
        page: 1,
        limit: 100
      }
    }
  });

  const getValueType = (val) => {
    switch (val) {
      case 0:
        return 'ADMIN';
      case 1:
        return 'CPO';
      case 2:
        return 'CORP';
    }
  };
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 3,
        background: '#fff'
      }}
    >
      <Container maxWidth="xl">
        <Card sx={{ position: 'relative', margin: '0 25px' }}>
          <Typography sx={{ m: 3 }} variant="h4">
            User Management
          </Typography>
          <NewUser
            header={'Add New User'}
            isSuperAdmin={getValueType(value) === 'ADMIN'}
            reload={() => (window ? window.location.reload() : () => {})}
            type={getValueType(value)}
            corporates={get(corpData, 'Corporates.docs', [])}
          />
        </Card>
        <Box sx={{ mt: 3, display: 'flex' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{
              marginLeft: '25px',
              marginTop: '25px',
              borderRadius: '8px',
              backgroundColor: '#fff',
              height: '100vh',
              textAlign: 'left'
            }}
            orientation="vertical"
            variant="scrollable"
          >
            <Tab
              sx={{ paddingX: '30px', alignItems: 'flex-end' }}
              label="Quikplugs"
            />
            <Tab
              sx={{ paddingX: '30px', alignItems: 'flex-end' }}
              label="CPO"
            />
            <Tab
              sx={{ paddingX: '30px', alignItems: 'flex-end' }}
              label="Corporate"
            />
            {/* <Tab sx={{ paddingX: '30px' }} label="Transactions" /> */}
          </Tabs>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <Box sx={{ margin: 3, borderBottom: 1, borderColor: 'divider' }}>
                <Users
                  kind={getValueType(value)}
                  isAdmins
                  // reloader={() => {}}
                  corporates={get(corpData, 'Corporates.docs', [])}
                  cpos={cpos}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

const UserPage = WithCpoCtx(FullWidthTabs);

UserPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default UserPage;
export const getServerSideProps = compose(auth);
