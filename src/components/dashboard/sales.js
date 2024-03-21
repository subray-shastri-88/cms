import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import allReservations from '../../graphQL/bookings/allReservations';
import { useLazyQuery , useQuery} from '@apollo/client';
import { get } from 'lodash';

export const Sales = (props) => {
  const theme = useTheme();

  const [year, setYear] = useState()


  const handleChange = (event) => {
    setYear(event.target.value);
  };

useEffect(()=>{
  if(year === undefined){
    setYear('2024')
  }
}, [year])

  const [ loadBookingsCount,  { data: bookingCounts }] = useLazyQuery(
    allReservations,
    {
      variables: {
        pagination: {
          page: 1,
          limit: 1000
        },
        janData: {
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-02-01T00:00:00.000Z`, createdAfter: `${year}-01-01T00:00:00.000Z`
        },
        febData: {
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-03-01T00:00:00.000Z`, createdAfter: `${year}-02-01T00:00:00.000Z`
        },
        marchData: {
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-04-01T00:00:00.000Z`, createdAfter: `${year}-03-01T00:00:00.000Z`
        },
        aprilData: {
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-05-01T00:00:00.000Z`, createdAfter: `${year}-04-01T00:00:00.000Z`
        },
        mayData: {
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-06-01T00:00:00.000Z`, createdAfter: `${year}-05-01T00:00:00.000Z`
        },
        junData: {
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-07-01T00:00:00.000Z`, createdAfter: `${year}-06-01T00:00:00.000Z`
        },
        julData: {
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-08-01T00:00:00.000Z`, createdAfter: `${year}-07-01T00:00:00.000Z`
        },
        augData: {
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-09-01T00:00:00.000Z`, createdAfter: `${year}-08-01T00:00:00.000Z`
        },
        sepData: {
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-10-01T00:00:00.000Z`, createdAfter: `${year}-09-01T00:00:00.000Z`
        },
        octData: {
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-11-01T00:00:00.000Z`, createdAfter: `${year}-10-01T00:00:00.000Z`
        },
        novData: {
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-12-01T00:00:00.000Z`, createdAfter: `${year}-11-01T00:00:00.000Z`
        },
        decData: {
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-12-01T24:00:00.000Z`, createdAfter: `${year}-12-01T00:00:00.000Z`
        },
      }
    }
  );

  useEffect(() => {
    loadBookingsCount();
  },[year])

  let jan = get(bookingCounts, 'janData.pagination.totalDocs', 0);
  let feb = get(bookingCounts, 'febData.pagination.totalDocs', 0);
  let mar = get(bookingCounts, 'marchData.pagination.totalDocs', 0);
  let apr = get(bookingCounts, 'aprilData.pagination.totalDocs', 0);
  let may = get(bookingCounts, 'mayData.pagination.totalDocs', 0);
  let jun = get(bookingCounts, 'junData.pagination.totalDocs', 0);
  let jul = get(bookingCounts, 'julData.pagination.totalDocs', 0);
  let aug = get(bookingCounts, 'augData.pagination.totalDocs', 0);
  let sep = get(bookingCounts, 'sepData.pagination.totalDocs', 0);
  let oct = get(bookingCounts, 'octData.pagination.totalDocs', 0);
  let nov = get(bookingCounts, 'novData.pagination.totalDocs', 0);
  let dec = get(bookingCounts, 'decData.pagination.totalDocs', 0);
  const data = {
    datasets: [
      {
        backgroundColor: '#3F51B5',
        barPercentage: 0.5,
        categoryPercentage: 0.5,
        data: [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec],
        label: 'No. of Bookings'
      }
    ],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    xAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
          beginAtZero: true,
          min: 0
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: theme.palette.divider
        }
      }
    ],
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
    <Card {...props}>
      <Box sx={{justifyContent:'space-between', display:'flex'}}>
        <CardHeader
          title="Bookings"
        />
        <Box sx={{margin:'10px', width:'200px' , paddingRight:'10px'}}>
          <FormControl sx={{width:'200px'}}>
            <InputLabel id="demo-simple-select-label">Year</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue={'2024'}
              value={year}
              label="Year"
              onChange={handleChange}
            >
              <MenuItem value={'2024'}>2024</MenuItem>
              <MenuItem value={'2023'}>2023</MenuItem>
              <MenuItem value={'2022'}>2022</MenuItem>
              <MenuItem value={'2021'}>2021</MenuItem>
              <MenuItem value={'2020'}>2020</MenuItem>
              <MenuItem value={'2019'}>2019</MenuItem>
              <MenuItem value={'2018'}>2018</MenuItem>
              <MenuItem value={'2017'}>2017</MenuItem>
              <MenuItem value={'2016'}>2016</MenuItem>
              <MenuItem value={'2015'}>2015</MenuItem>
            </Select>
          </FormControl>
        </Box> 
      </Box>

      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: 'relative'
          }}
        >
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2
        }}
      >
        {/* <Button
          color="primary"
          endIcon={<ArrowRightIcon fontSize="small" />}
          size="small"
        >
          Overview
        </Button> */}
      </Box>
    </Card>
  );
};
