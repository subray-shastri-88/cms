import React from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  useTheme,
  Grid
} from '@mui/material';

import data from './__mocks__/data';
const { chargerTypes, acPlugTypes, plugTypes, powerTypes, newChargers } = data;

const Analysis = () => {
  const theme = useTheme();
  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item md={4} xs={12}>
        <Card>
          <CardHeader subheader="Charging Machine Types" title="Charger Type" />
          <CardContent>
            <Box
              sx={{
                height: 300,
                position: 'relative'
              }}
            >
              <Pie options={options} data={chargerTypes} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={4} xs={12}>
        <Card>
          <CardHeader
            subheader="Number of plug varities of DC Machines"
            title="DC Plugs"
          />
          <CardContent>
            <Box
              sx={{
                height: 300,
                position: 'relative'
              }}
            >
              <Doughnut options={options} data={plugTypes} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={4} xs={12}>
        <Card>
          <CardHeader
            subheader="Number of plug varities of AC Machines"
            title="AC Plugs"
          />
          <CardContent>
            <Box
              sx={{
                height: 300,
                position: 'relative'
              }}
            >
              <Doughnut options={options} data={acPlugTypes} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item md={8} xs={12}>
        <Card>
          <CardHeader
            subheader="Number of charger types installed every month"
            title="Newly Installed Charger Types"
          />
          <CardContent>
            <Box
              sx={{
                height: 300,
                position: 'relative'
              }}
            >
              <Bar options={options} data={newChargers} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={4} xs={12}>
        <Card>
          <CardHeader
            subheader="Machine variations with power"
            title="Powers in KW"
          />
          <CardContent>
            <Box
              sx={{
                height: 300,
                position: 'relative'
              }}
            >
              <Doughnut options={options} data={powerTypes} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Analysis;
