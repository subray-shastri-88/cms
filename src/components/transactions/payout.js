import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TablePagination,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import PerfectScrollbar from 'react-perfect-scrollbar';
import getBookings from '../../graphQL/bookings';
import { useQuery } from '@apollo/client';
import Ring from '../ui/Loader/Ring';
import Pagination from '@mui/material/Pagination';
import { mockData } from './_mock';
import QueryTable, { TableBuilder } from '../queryTable';

const PayOuts = ({ cpoId }) => {
  const [reservations, setReservations] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(1000);
  const [openQueryTable, setOpenQueryTable] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState({});

  const getBDate = (item) => {
    if (!item) {
      return '--';
    }
    const date = new Date(item * 1);
    return (
      date.getDate() +
      '/' +
      (date.getMonth() + 1) +
      '/' +
      date.getFullYear() +
      '   ' +
      date.getHours() +
      ':' +
      date.getMinutes()
    );
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'HOLD':
        return <Chip color="warning" size="small" label="Payment Pending" />;
      case 'COMPLETED':
        return <Chip color="success" size="small" label="Charging Completed" />;
      case 'RESERVED':
        return <Chip color="primary" size="small" label="Reserved Slot" />;
      case 'RUNNING':
        return <Chip color="info" size="small" label="Ongoing Session" />;
      case 'CANCELED':
        return <Chip color="error" size="small" label="Cancelled" />;
      default:
        return <Chip size="small" label="--" />;
    }
  };

  const handleOpen = (item) => {
    setSelectedBooking(item);
    setOpenQueryTable(true);
  };

  const handleClose = () => {
    setSelectedBooking({});
    setOpenQueryTable(false);
  };

  const getSettlementChip = (status) => {
    switch (status) {
      case 'UNSETTLED':
        return (
          <Chip
            sx={{ width: '85px' }}
            color="warning"
            size="small"
            label="Ready"
          />
        );
      case 'SETTLED':
        return (
          <Chip
            sx={{ width: '85px' }}
            color="success"
            size="small"
            label="Settled"
          />
        );
      case 'NOT_READY':
        return (
          <Chip
            color="error"
            sx={{ width: '85px' }}
            size="small"
            label="Not Ready"
          />
        );
      default:
        return <Chip sx={{ width: '85px' }} size="small" label="--" />;
    }
  };

  const getUKeyValue = (mainKey, key) => {
    return selectedBooking[mainKey][key] || '--';
  };

  const getKeyValue = (key) => {
    const item = selectedBooking[key];
    switch (key) {
      case 'cpo': {
        const { __typename, ...rest } = item;
        return (
          <TableBuilder
            item={rest}
            getQueryValue={(val) => getUKeyValue('cpo', val)}
          />
        );
      }
      case 'station': {
        const { __typename, ...rest } = item;
        return (
          <TableBuilder
            item={rest}
            getQueryValue={(val) => getUKeyValue('station', val)}
          />
        );
      }
      case 'user': {
        const { __typename, ...rest } = item;
        return (
          <TableBuilder
            item={rest}
            getQueryValue={(val) => getUKeyValue('user', val)}
          />
        );
      }
      case 'charger': {
        const { ...rest } = item;
        return (
          <TableBuilder
            item={rest}
            getQueryValue={(val) => getUKeyValue('charger', val)}
          />
        );
      }
      case 'plug': {
        const { ...rest } = item;
        return (
          <TableBuilder
            item={rest}
            getQueryValue={(val) => getUKeyValue('plug', val)}
          />
        );
      }
      case 'status': {
        return getStatusChip(item);
      }
      case 'settlement': {
        return getSettlementChip(item);
      }
      case 'acceptStartChargingAt':
      case 'startTime':
      case 'endTime':
      case 'createdAt':
      case 'holdExpiry':
        return getBDate(item);
      default:
        return item || '--';
    }
  };

  const { loading, error, data, refetch } = useQuery(getBookings, {
    variables: {
      filter: {
        status: ['COMPLETED'],
        cpoId: cpoId
      },
      pagination: {
        page: 0,
        limit: rowsPerPage
      }
    }
  });

  const handlePagination = (page) => {
    refetch({
      filter: {
        status: ['COMPLETED'],
        cpoId: cpoId
      },
      pagination: {
        page: page,
        limit: rowsPerPage
      }
    });
  };

  useEffect(() => {
    const mock = get(mockData, 'Reservations.docs', []);
    const lists = get(data, 'Reservations.docs', mock);
    setReservations(mock);
  }, [loading, error, data]);

  const duration = (timestamp1, timestamp2) => {
    if (!timestamp1 || !timestamp2) {
      return '--';
    }
    var difference = timestamp2 - timestamp1;
    var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    var hoursDifference = Math.floor(difference / 1000 / 60);
    hoursDifference = Math.abs(hoursDifference);
    return `${hoursDifference} mins`;
  };

  return (
    <React.Fragment>
      {loading && <Ring />}
      <Box>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Station</TableCell>
              <TableCell>CPO</TableCell>
              <TableCell>Units (kw)</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Amount (₹)</TableCell>
              <TableCell>CPO (₹)</TableCell>
              <TableCell>Aggr (₹)</TableCell>
              <TableCell>For Settlement</TableCell>
              <TableCell>More</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{get(item, 'station.name', '--')}</TableCell>
                  <TableCell>{get(item, 'cpo.name', '--')}</TableCell>
                  <TableCell>{get(item, 'unitsConsumed', '--')}</TableCell>
                  <TableCell>
                    {duration(
                      get(item, 'startTime', null),
                      get(item, 'endTime', null)
                    )}
                  </TableCell>
                  <TableCell>₹ {get(item, 'amount', '--')}</TableCell>
                  <TableCell>₹ {get(item, 'payoutAmount', '-')}</TableCell>
                  <TableCell>₹ {get(item, 'quickPlugFees', '-')}</TableCell>
                  <TableCell>
                    {getSettlementChip(get(item, 'settlement', ''))}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(item)}>
                      <InfoIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      {reservations.length <= 0 && (
        <Card>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '150px',
              width: '100%'
            }}
          >
            No reservations found
          </div>
        </Card>
      )}
      <Card>
        <CardContent
          sx={{ float: 'right', display: 'flex', flexDirection: 'row' }}
        >
          <span style={{ padding: '4px' }}> Page : </span>
          <Pagination
            count={get(data, 'Reservations.pagination.totalPages', 1)}
            showFirstButton={get(
              data,
              'Reservations.pagination.hasPrevPage',
              false
            )}
            showLastButton={get(
              data,
              'Reservations.pagination.hasNextPage',
              false
            )}
            onChange={(e, page) => {
              handlePagination(page);
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Button variant="contained">Create New Payout Batch</Button>
          <p style={{ fontSize: '8px', marginTop: '10px' }}>
            <b>Note : </b>Maximum 1000 bookings can be dispatched for settlement
            in one batch
          </p>
        </CardContent>
      </Card>
      <QueryTable
        open={openQueryTable}
        handleClose={handleClose}
        queryObject={selectedBooking}
        getQueryValue={getKeyValue}
      />
    </React.Fragment>
  );
};

PayOuts.propTypes = {
  cpoID: PropTypes.string
};

export default PayOuts;
