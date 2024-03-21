import React from 'react';
import { get } from 'lodash';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  Chip
} from '@mui/material';

const Transactions = ({ transactions = [] }) => {
  const getBookingDate = (item) => {
    const timestamp = get(item, 'updatedAt', null);
    if (!timestamp) {
      return '--';
    }
    const date = new Date(timestamp * 1);
    return (
      date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
    );
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'CREDIT':
        return <Chip color="success" size="small" label="Credited" />;
      case 'DEBIT':
        return <Chip color="error" size="small" label="Debited" />;
    }
  };

  return (
    <React.Fragment>
      <Box>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    {getStatusChip(get(item, 'status', '--'))}
                  </TableCell>
                  <TableCell>{get(item, 'amount', '--')}</TableCell>
                  <TableCell>{getBookingDate(item)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      {transactions.length <= 0 && (
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
            No transactions found
          </div>
        </Card>
      )}
    </React.Fragment>
  );
};

export default Transactions;
