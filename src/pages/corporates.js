import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { get } from 'lodash';
import {
  Box,
  Container,
  Card,
  CardHeader,
  Typography,
  Button,
  Tabs,
  Tab,
  CardContent,
  TextField,
  Grid,
  Autocomplete
} from '@mui/material';
import { CustomerListResults } from '../components/customer/customer-list-results';
import { CustomerListToolbar } from '../components/customer/customer-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { customers } from '../__mocks__/customers';
import Listings from '../components/corporates/Listing';
import TabPanel, { a11yProps } from '../components/ui/TabPanel';
import Operator from '../components/operators/Operator';
import Metrics from '../components/corporates/Metrics';
import { CorpFilter } from '../components/corporates/Filters/home';
import Bookings from '../components/bookings';
import CorpWallet from '../components/transactions/corpwallet';
import NewCorporate from '../components/addNewPartner/corporate';
import NewDriver from '../components/addNewPartner/driver';
import { DriveEtaTwoTone } from '@mui/icons-material';
import { WithCpoCtx } from '../contexts/cpoContext';
import { corporatesList } from '../graphQL/corporate';
import { useQuery, useLazyQuery } from '@apollo/client';
import { CorporateDetail } from './corporate/[id]';

const Corporates = ({ cpos }) => {
  const [corporate, setCorporate] = useState('');
  const [cpo, setCpo] = useState('');
  const [corporateList, setCorporatesList] = useState([]);
  const [trigger, setTrigger] = useState(false);

  const handleCpoChange = (value) => {
    setCorporate('');
    setCpo(value);
  };

  const {
    loading,
    error,
    data: corpData,
    refetch: corpRefetch
  } = useQuery(corporatesList, {
    variables: {
      pagination: {
        page: 1,
        limit: 10
      }
    }
  });

  const reloadCorps = () => {
    corpRefetch({
      pagination: {
        page: 1,
        limit: 10
      }
    });
  };

  const handleChange = (value) => {
    setCorporate(value);
  };

  useEffect(() => {
    setTrigger(false);
  }, [corporate]);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 3,
        display: "flex",
      }}
    >
      <Container maxWidth={'xl'}>
        <Card sx={{ position: 'relative', mx: '2%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography sx={{ m: 3 }} variant="h4">
              Corporate Partners
            </Typography>
            <div style={{ display: 'flex', marginRight: '15%' }}>
              {/* <Autocomplete
                options={cpos || []}
                onChange={(event, value) => handleCpoChange(value)}
                renderInput={(params) => (
                  <TextField {...params} label="CPO" sx={{ mx: 1 }} />
                )}
                sx={{ mx: 1, width: '200px' }}
                value={cpo}
              /> */}
              <Autocomplete
                key={(corporate && corporate.label) || corporate}
                options={corporateList}
                onChange={(event, value) => handleChange(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Corporate" sx={{ mx: 3 }} />
                )}
                sx={{ mx: 1, width: '100%' }}
                value={corporate}
              />
            </div>
          </div>

          {corporate ? (
            <NewDriver
              header="Onboard New Driver"
              corporate={corporate}
              fetch={() => setTrigger(true)}
            />
          ) : (
            <NewCorporate
              header="New Corporate Partner"
              reloadCorps={reloadCorps}
            />
          )}
        </Card>
        <Card
          sx={{
            position: 'relative',
            marginTop: '2%',
            mx: '2%',
            paddingTop: '0px'
          }}
        >
          {corporate ? (
            <CorporateDetail
              corpId={corporate.id}
              trigger={trigger}
              corporate={corporate}
            />
          ) : (
            <Listings
              updateList={setCorporatesList}
              refetch={corpRefetch}
              data={corpData}
              reloadCorps={reloadCorps}
            />
          )}
        </Card>
      </Container>
    </Box>
  );
};

const CorporatesPage = WithCpoCtx(Corporates);

CorporatesPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CorporatesPage;
