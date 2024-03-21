import '../utils/styles/login.css';

import { ApolloProvider } from '@apollo/client';
import { CssBaseline } from '@mui/material';
/* eslint-disable @next/next/no-sync-scripts */
import Head from 'next/head';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import client from '../../apollo-client';
import { theme } from '../theme';
import CpoCtxProvider from '../contexts/cpoContext';
import UserCtxProvider from '../contexts/userContext';

const App = (props) => {
  const { Component, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Quik Plugs</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        {/* <script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCJ6fdqo3J312lhCz2bDXuymBB7KRRP-F0&callback=initMap&v=weekly&channel=2"
          async
        ></script> */}
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css"
          rel="stylesheet"
        ></link>
        <script src="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.js"></script>
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <UserCtxProvider>
          <CpoCtxProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {getLayout(<Component {...pageProps} />)}
            </ThemeProvider>
          </CpoCtxProvider>
        </UserCtxProvider>
      </LocalizationProvider>
    </ApolloProvider>
  );
};

// pk.eyJ1Ijoic2F0aHlhbmFyYXlhbmE3NTEiLCJhIjoiY2t5MDdqZzlzMDBoMTJ2bnFneHdlZmlxbyJ9.vnLMgju7lX0q475GT5BnkQ
export default App;
