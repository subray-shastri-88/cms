import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { get } from 'lodash';
import { Box, Container, Card, Typography, Grid } from '@mui/material';
import { DashboardLayout } from '../../../components/dashboard-layout';
import Users from '../../../components/users';
import NewCorpUser from '../../../components/addNewPartner/corporateUser';
import compose from '../../../utils/compose';
import { auth } from '../../../utils/ssrUtils';
import { useLazyQuery } from '@apollo/client';
import { getCorporate, getDriverList } from '../../../graphQL/corporate';

const FullWidthTabs = () => {
  const router = useRouter();
  const { id: partnerId } = router.query;
  const [reload, setReload] = useState({ fetch: () => {} });
  const [corporate, setCorporate] = useState({});

  const [getCorporateData, { data: corpData }] = useLazyQuery(getCorporate, {
    variables: {
      corporateId: partnerId
    }
  });

  useEffect(() => {
    if (partnerId) {
      getCorporateData();
    }
  }, [partnerId]);

  useEffect(() => {
    const data = get(corpData, 'Corporate', '');
    setCorporate(data);
  }, [corpData]);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 2,
        background: '#fff'
      }}
    >
      <Container maxWidth="xl">
        <Card sx={{ position: 'relative', margin: '0 25px' }}>
          <Typography sx={{ m: 3 }} variant="h4">
            User Management
          </Typography>
          <NewCorpUser
            kind="CORP"
            header={'Add New User'}
            reload={reload}
            resourceId={corporate.id}
          />
        </Card>
        <Grid container spacing={3}>
          <Grid item md={12} xs={12}>
            <Box sx={{ margin: 3, borderBottom: 1, borderColor: 'divider' }}>
              {corporate.id && (
                <Users
                  kind="CORP"
                  isAdmins
                  // reloader={setReload}
                  resourceId={corporate.id}
                  corporates={[{ ...corporate }]}
                  cpos={[]}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

FullWidthTabs.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default FullWidthTabs;
export const getServerSideProps = compose(auth);
