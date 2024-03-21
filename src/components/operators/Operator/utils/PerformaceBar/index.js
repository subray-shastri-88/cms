import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  useTheme,
  Button,
  Grid,
  Typography
} from '@mui/material';
import Metrics from './Metrics';
import stationsQuery from '../../../../../graphQL/stations';
import allReservations from '../../../../../graphQL/bookings/allReservations';
import revenueData from '../../../../../graphQL/bookings/revenueData';
import { useLazyQuery } from '@apollo/client';
import { round } from 'lodash'
import { Pie, Doughnut } from 'react-chartjs-2';

const HighLight = ({
  label,
  value,
  valueStyle = {},
  labelStyle = {},
  textSecondaryLabel
}) => {
  return (
    <Grid item lg={6} md={6}>
      <Card elevation={11}>
        <CardContent
          sx={{
            paddingY: '10px !important',
            padding: {
              xs: '10px !important',
              sm: '10px !important',
              md: '10px !important',
              lg: '15px !important'
            }
          }}
          md={{ padding: '10px !important' }}
        >
          <Typography color="textSecondary" variant="subtitle2" sx={valueStyle}>
            {label}
          </Typography>
          <Typography color="textPrimary" variant="customh5" sx={valueStyle}>
            {value}
          </Typography>
          {textSecondaryLabel && (
            <Typography color="textSecondary" variant="caption">
              {textSecondaryLabel}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

const PerformanceBar = ({ cpoId, stationId , header , color, year}) => {
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
  const [counts, setCounts] = useState({
    booking: 0,
    powerConsumed: 0,
    powerCost: 0,
    revenue: 0,
    totalStations: 0,
    unBilledAmount: 0,
    serviceCharges: 0,
    totalGst: 0
  });

  console.log(year , 'year1');

  const { ReservationAnalytics } = stationsQuery;

  const [loadAnalytics, { data: analyticsData }] = useLazyQuery(
    ReservationAnalytics,
    {
      variables: {
        filter: {
          cpoId: cpoId,
          stationId: stationId
        }
      }
    }
  );

  const [loadBookingsCount, { data: bookingCounts }] = useLazyQuery(
    allReservations,
    {
      variables: {
        pagination: {
          page: 1,
          limit: 1000
        },
        janData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-02-01T00:00:00.000Z`, createdAfter: `${year}-01-01T00:00:00.000Z`
        },
        febData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-03-01T00:00:00.000Z`, createdAfter: `${year}-02-01T00:00:00.000Z`
        },
        marchData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-04-01T00:00:00.000Z`, createdAfter: `${year}-03-01T00:00:00.000Z`
        },
        aprilData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-05-01T00:00:00.000Z`, createdAfter: `${year}-04-01T00:00:00.000Z`
        },
        mayData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-06-01T00:00:00.000Z`, createdAfter: `${year}-05-01T00:00:00.000Z`
        },
        junData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-07-01T00:00:00.000Z`, createdAfter: `${year}-06-01T00:00:00.000Z`
        },
        julData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-08-01T00:00:00.000Z`, createdAfter: `${year}-07-01T00:00:00.000Z`
        },
        augData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-09-01T00:00:00.000Z`, createdAfter: `${year}-08-01T00:00:00.000Z`
        },
        sepData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-10-01T00:00:00.000Z`, createdAfter: `${year}-09-01T00:00:00.000Z`
        },
        octData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-11-01T00:00:00.000Z`, createdAfter: `${year}-10-01T00:00:00.000Z`
        },
        novData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-12-01T00:00:00.000Z`, createdAfter: `${year}-11-01T00:00:00.000Z`
        },
        decData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['RESERVED', 'HOLD', 'CANCELED', 'COMPLETED', 'RUNNING'],
          createdBefore: `${year}-12-01T24:00:00.000Z`, createdAfter: `${year}-12-01T00:00:00.000Z`
        },
      }
    }
  );

  const [loadRevenueCount, { data: revenueCounts }] = useLazyQuery(
    revenueData,
    {
      variables: {
        pagination: {
          page: 1,
          limit: 100000000
        },
        janData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['COMPLETED'],
          createdBefore: `${year}-02-01T00:00:00.000Z`, createdAfter: `${year}-01-01T00:00:00.000Z`
        },
        febData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['COMPLETED'],
          createdBefore: `${year}-03-01T00:00:00.000Z`, createdAfter: `${year}-02-01T00:00:00.000Z`
        },
        marchData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['COMPLETED'],
          createdBefore: `${year}-04-01T00:00:00.000Z`, createdAfter: `${year}-03-01T00:00:00.000Z`
        },
        aprilData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['COMPLETED'],
          createdBefore: `${year}-05-01T00:00:00.000Z`, createdAfter: `${year}-04-01T00:00:00.000Z`
        },
        mayData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['COMPLETED'],
          createdBefore: `${year}-06-01T00:00:00.000Z`, createdAfter: `${year}-05-01T00:00:00.000Z`
        },
        junData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['COMPLETED'],
          createdBefore: `${year}-07-01T00:00:00.000Z`, createdAfter: `${year}-06-01T00:00:00.000Z`
        },
        julData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['COMPLETED'],
          createdBefore: `${year}-08-01T00:00:00.000Z`, createdAfter: `${year}-07-01T00:00:00.000Z`
        },
        augData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['COMPLETED'],
          createdBefore: `${year}-09-01T00:00:00.000Z`, createdAfter: `${year}-08-01T00:00:00.000Z`
        },
        sepData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['COMPLETED'],
          createdBefore: `${year}-10-01T00:00:00.000Z`, createdAfter: `${year}-09-01T00:00:00.000Z`
        },
        octData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['COMPLETED'],
          createdBefore: `${year}-11-01T00:00:00.000Z`, createdAfter: `${year}-10-01T00:00:00.000Z`
        },
        novData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['COMPLETED'],
          createdBefore: `${year}-12-01T00:00:00.000Z`, createdAfter: `${year}-11-01T00:00:00.000Z`
        },
        decData: {
          cpoId: cpoId,
          stationId: stationId,
          status: ['COMPLETED'],
          createdBefore: `${year}-12-01T24:00:00.000Z`, createdAfter: `${year}-12-01T00:00:00.000Z`
        },
      }
    }
  );

  useEffect(() => {
    if (cpoId || stationId || !cpoId || !stationId) {
      loadAnalytics();
    }
    loadBookingsCount();
    loadRevenueCount();
  }, [cpoId, stationId]);

  const removeNull = (data, key) => {
    const value = get(data, `${key}`, 0);
    const filteredValue = value !== null ? value : 0;
    return filteredValue;
  };

  useEffect(() => {
    const booking = removeNull(analyticsData, 'ReservationAnalytics.booking');
    const powerConsumed = removeNull(
      analyticsData,
      'ReservationAnalytics.powerConsumed'
    );
    const powerCost = removeNull(
      analyticsData,
      'ReservationAnalytics.powerCost'
    );
    const revenue = removeNull(analyticsData, 'ReservationAnalytics.revenue');
    const totalStations = removeNull(
      analyticsData,
      'ReservationAnalytics.totalStations'
    );
    const serviceCharges = removeNull(
      analyticsData,
      'ReservationAnalytics.serviceCharges'
    );
    const totalGst = removeNull(
      analyticsData,
      'ReservationAnalytics.totalGst'
    );

    const unBilledAmount = removeNull(
      analyticsData,
      'ReservationAnalytics.unBilledAmount'
    );

    setCounts({
      booking,
      powerConsumed,
      powerCost,
      revenue,
      totalStations,
      unBilledAmount,
      totalGst,
      serviceCharges
    });
  }, [analyticsData]);

  const getSumByKey = (arr, key) => {
    return arr.reduce((accumulator, current) => accumulator + Number(current[key]), 0)
  }

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

  let janRevenue = get(revenueCounts, 'janData.docs', 0);
  let febRevenue = get(revenueCounts, 'febData.docs', 0);
  let marRevenue = get(revenueCounts, 'marchData.docs', 0);
  let aprRevenue = get(revenueCounts, 'aprilData.docs', 0);
  let mayRevenue = get(revenueCounts, 'mayData.docs', 0);
  let junRevenue = get(revenueCounts, 'junData.docs', 0);
  let julRevenue = get(revenueCounts, 'julData.docs', 0);
  let augRevenue = get(revenueCounts, 'augData.docs', 0);
  let sepRevenue = get(revenueCounts, 'sepData.docs', 0);
  let octRevenue = get(revenueCounts, 'octData.docs', 0);
  let novRevenue = get(revenueCounts, 'novData.docs', 0);
  let decRevenue = get(revenueCounts, 'decData.docs', 0);

  let jansum = janRevenue !== 0 ? getSumByKey(janRevenue , 'amount') : 0;
  let febsum = febRevenue !== 0 ? getSumByKey(febRevenue , 'amount') : 0;
  let marsum = marRevenue !== 0 ? getSumByKey(marRevenue , 'amount') : 0;
  let aprsum = aprRevenue !== 0 ? getSumByKey(aprRevenue , 'amount') : 0;
  let maysum = mayRevenue !== 0 ? getSumByKey(mayRevenue , 'amount') : 0;
  let junsum = junRevenue !== 0 ? getSumByKey(junRevenue , 'amount') : 0;
  let julsum = julRevenue !== 0 ? getSumByKey(julRevenue , 'amount') : 0;
  let augsum = augRevenue !== 0 ? getSumByKey(augRevenue , 'amount') : 0;
  let sepsum = sepRevenue !== 0 ? getSumByKey(sepRevenue , 'amount') : 0;
  let octsum = octRevenue !== 0 ? getSumByKey(octRevenue , 'amount') : 0;
  let novsum = novRevenue !== 0 ? getSumByKey(novRevenue , 'amount') : 0;
  let decsum = decRevenue !== 0 ? getSumByKey(decRevenue , 'amount') : 0;

  let janunit = janRevenue !== 0 ? getSumByKey(janRevenue , 'unitsConsumed') : 0;
  let febunit = febRevenue !== 0 ? getSumByKey(febRevenue , 'unitsConsumed') : 0;
  let marunit = marRevenue !== 0 ? getSumByKey(marRevenue , 'unitsConsumed') : 0;
  let aprunit = aprRevenue !== 0 ? getSumByKey(aprRevenue , 'unitsConsumed') : 0;
  let mayunit = mayRevenue !== 0 ? getSumByKey(mayRevenue , 'unitsConsumed') : 0;
  let jununit = junRevenue !== 0 ? getSumByKey(junRevenue , 'unitsConsumed') : 0;
  let julunit = julRevenue !== 0 ? getSumByKey(julRevenue , 'unitsConsumed') : 0;
  let augunit = augRevenue !== 0 ? getSumByKey(augRevenue , 'unitsConsumed') : 0;
  let sepunit = sepRevenue !== 0 ? getSumByKey(sepRevenue , 'unitsConsumed') : 0;
  let octunit = octRevenue !== 0 ? getSumByKey(octRevenue , 'unitsConsumed') : 0;
  let novunit = novRevenue !== 0 ? getSumByKey(novRevenue , 'unitsConsumed') : 0;
  let decunit = decRevenue !== 0 ? getSumByKey(decRevenue , 'unitsConsumed') : 0;


  let power_cost = round(counts.powerCost , 2) || 0;
  let totalServiceCharge = round(counts.serviceCharges , 2) || 0;
  let totalGST = round(counts.totalGst , 2) || 0 ;
  let total_revenue = round(counts.revenue , 2) || 0;
  let total_units = round(counts.powerConsumed , 2) || 0;

  const totalBookings = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Total Bookings',
        data: [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec],
        backgroundColor: "rgb(63, 81, 181)"
      }
    ]
  };

  const totalRevenue = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Total Revenue (₹)',
        data: [jansum, febsum, marsum, aprsum, maysum, junsum, julsum, augsum, sepsum, round(octsum, 2), novsum, decsum],
        backgroundColor: "rgb(240, 153, 207)"
      }
    ]
  };

  const totalCOnsumption = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Total Unit Consumption (kW)',
        data: [janunit, febunit, marunit, aprunit, mayunit, jununit, julunit, augunit, sepunit, round(octunit , 2), novunit, decunit],
        backgroundColor: "rgb(128, 224, 157)"
      }
    ]
  };

  return (
    <React.Fragment>
      <Grid container spacing={1}>
        <Grid item lg={4} mds={6} md={12}>
          <Grid
            container
            spacing={3}
            sx={{ marginTop: '1px', paddingRight: '10px !important' }}
          >
            <HighLight
              label="Revenue"
              value={`₹ ${total_revenue}`}
              labelStyle={{ color: 'rgb(63, 81, 181)' }}
              textSecondaryLabel="Total Business"
            />
            <HighLight
              label="UnBilled Amount"
              value={`₹ ${counts.unBilledAmount}`}
              textSecondaryLabel={`Bill Date - ${new Date().toLocaleDateString()}`}
            />
            <HighLight
              label="No of Bookings"
              value={counts.booking}
              textSecondaryLabel="Total Bookings "
            />
            <HighLight
              label="Power Consumed (kW)"
              value={total_units}
              textSecondaryLabel="To Charge EV"
            />
            <HighLight
              label="Power Cost"
              value={`₹ ${power_cost}`}
              textSecondaryLabel=""
            />
            <HighLight
              label="Total Stations"
              value={counts.totalStations}
              textSecondaryLabel=""
            />
            <HighLight
              label="Total Service Charges"
              value={`₹ ${totalServiceCharge}`}
              textSecondaryLabel=""
            />
            <HighLight
              label="Total GST"
              value={`₹ ${totalGST}`}
              textSecondaryLabel=""
            />
          </Grid>
        </Grid>
        <Grid item lg={8} mds={6} md={12}>
          <Metrics header="No of bookings" color="rgb(63, 81, 181)" totalBookings={totalBookings} useLine />
        </Grid>
        <Grid item md={6}>
          <Metrics header="Total Revenue" color="rgba(240, 153, 207)" totalBookings={totalRevenue} />
        </Grid>

        <Grid item md={6}>
          <Metrics
            header="Total Power Consumption"
            color="rgba(128, 224, 157)"
            totalBookings={totalCOnsumption}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default PerformanceBar;
