import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { useRouter } from 'next/router';
import { Box, Container, Card, Typography } from '@mui/material';
import { DashboardLayout } from '../../../components/dashboard-layout';
import FleetList from '../../../components/corporate/Fleet';
import AddNewFleet from '../../../components/corporate/Fleet/addFleet';
import { getCorporate } from '../../../graphQL/corporate';
import { useLazyQuery } from '@apollo/client';

const Fleet = () => {
  const router = useRouter();
  const { id: partnerId } = router.query;

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
        py: 2
      }}
    >
      {partnerId && (
        <FleetList corpId={partnerId} fleetType={corporate.fleetType} />
      )}
    </Box>
  );
};

const CorporatesPage = Fleet;

CorporatesPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CorporatesPage;
