import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  useTheme,
  Button,
  Grid
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Bar, Line } from 'react-chartjs-2';

const Metrics = ({ header, color, useLine = false ,totalBookings }) => {
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

  const labels = [63, 15, 22, 63, 15, 40, 30, 15, 22, 63];

  // borderColor: 'rgb(255, 99, 132)',

  // const totalBookings = {
  //   labels: labels,
  //   datasets: [
  //     {
  //       label: header,
  //       data: [16, 6, 20, 36, 51, 4, 10, 15, 12, 36],
  //       backgroundColor: color
  //     }
  //   ]
  // };
  return (
    <React.Fragment>
      <Card sx={{ marginTop: '20px' }}>
        <CardHeader sx={{ padding: '15px 20px 0' }} subheader={header} />
        <CardContent>
          <Box
            sx={{
              height: 300,
              position: 'relative'
            }}
          >
            {useLine ? (
              <Line options={options} data={totalBookings} />
            ) : (
              <Bar options={options} data={totalBookings} />
            )}
          </Box>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default Metrics;
