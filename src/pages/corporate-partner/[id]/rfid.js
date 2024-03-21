import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Card,
  Typography,
  Grid,
  Autocomplete,
  TextField
} from '@mui/material';
import { DashboardLayout } from '../../../components/dashboard-layout';
import RFIDs from '../../../components/RFIDs';
import AssignRFID from '../../../components/RFIDs/newRFID';
import { WithCpoCtx } from '../../../contexts/cpoContext';
import compose from '../../../utils/compose';
import { auth } from '../../../utils/ssrUtils';
import { GetRfidTags } from '../../../graphQL/rfid';
import { useLazyQuery } from '@apollo/client';
import { RFIDTagsAPI } from '../../../graphQL/rfid';
import { getCorporate, getDriverList } from '../../../graphQL/corporate';

const Rfids = ({ cpos }) => {
  const router = useRouter();
  const { id: partnerId } = router.query;
  const { rfidTags, pagination, getRfidTags, loading } = GetRfidTags();

  const [corporate, setCorporate] = useState({});
  const [getCorporateData, { data: corpData }] = useLazyQuery(getCorporate, {
    variables: {
      corporateId: partnerId
    }
  });

  const [getRfIds, { data: rfids, error: err , refetch }] = useLazyQuery(RFIDTagsAPI, {
    variables: {
      pagination: {
        limit: 10,
        page: 1
      },
      filter: {
        corporateId: partnerId,
      }
    }
  });

  const pageRefetch = (page = 1) =>{
    refetch({
      filter: {
        corporateId: partnerId,
      },
      pagination: {
        page: page,
        limit: 10,
      },
    });
  }

  useEffect(() => {
    if (partnerId) {
      getCorporateData();
    }
  }, [partnerId]);

  useEffect(() => {
    const data = get(corpData, 'Corporate', '');
    setCorporate(data);
  }, [corpData]);

  const handledPagination = (page = 1) => {
    getRfidTags({
      corpId: partnerId,
      page
    });
  };

  useEffect(() => {
    getRfidTags({
      corpId: partnerId
    });
    getRfIds();
  }, []);


  console.log(get(rfids , 'RFIDTags.docs' , []))
  console.log('')

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 2,
        "@media (max-width: 600px)": { 
          padding: "1rem",
        },
        "@media (min-width: 601px) and (max-width: 1024px)": { 
          padding: "2rem",
        },
      }}
    >
      <Container maxWidth="xl">
        <Card sx={{ position: 'relative', margin: '0 25px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography sx={{ m: 3 }} variant="h4">
              RFID Management
            </Typography>
          </div>
        </Card>
        <Grid container spacing={3}>
          <Grid item md={12} xs={12}>
            <Card
              sx={{
                position: 'relative',
                marginTop: '30px',
                mx: '25px',
                paddingTop: '20px'
              }}
            >
              <RFIDs
                handledPagination={handledPagination}
                rfidTags={rfids && rfids ? get(rfids , 'RFIDTags.docs' , []) : []}
                pagination={pagination}
                loading={loading}
                refetch={pageRefetch}
              />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

Rfids.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

const RfidsPage = WithCpoCtx(Rfids);

RfidsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default RfidsPage;
export const getServerSideProps = compose(auth);
