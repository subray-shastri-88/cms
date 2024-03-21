import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  Typography,
  Grid,
  Autocomplete,
  TextField
} from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';
import RFIDs from '../components/RFIDs';
import AssignRFID from '../components/RFIDs/newRFID';
import { WithCpoCtx } from '../contexts/cpoContext';
import compose from '../utils/compose';
import { auth } from '../utils/ssrUtils';
import { GetRfidTags, RFIDTagsAPI } from '../graphQL/rfid';
import { useLazyQuery } from "@apollo/client";
import { get } from 'lodash';

const Rfids = ({ cpos }) => {
  const [cpo, setCpo] = useState('');
  const { rfidTags, pagination, getRfidTags, loading } = GetRfidTags();

  const handleCpoChange = (value) => {
    setCpo(value);
  };

  const [getRfIds, { data: rfids, error: err, refetch }] = useLazyQuery(RFIDTagsAPI, {
    variables: {
      pagination: {
        limit: 10,
        page: 1
      },
      filter: {
        cpoId: cpo?.id || null
      }
    }
  });

  const onChangeStatus = () => {
    refetch({
      pagination: {
        page: 1,
        limit: 10,
      },
      filter: {
        cpoId: cpo?.id || null
      }
    });
  }

  const handledPagination = (page) => {
    refetch({
      pagination: {
        page: page,
        limit: 10,
      },
      filter: {
        cpoId: cpo?.id || null
      }
    });
  };

  useEffect(() => {
    getRfidTags({
      cpoId: cpo?.id || null
    });
    getRfIds();
  }, [cpo]);

  let getAllRfids = get(rfids, 'RFIDTags.docs', []);
  let getPagination = get(rfids, 'RFIDTags.pagination' , []);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 3,
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
            <div style={{ display: 'flex', marginRight: '15%' }}>
              <Autocomplete
                options={cpos || []}
                onChange={(event, value) => handleCpoChange(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Partner" sx={{ mx: 1 }} />
                )}
                sx={{ mx: 1, width: '200px' }}
                value={cpo}
                size="small"
              />
            </div>
          </div>
          <AssignRFID header={'Add New RFID'} loadData={handledPagination} />
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
                rfidTags={getAllRfids}
                pagination={getPagination}
                loading={loading}
                refetch={onChangeStatus}
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
