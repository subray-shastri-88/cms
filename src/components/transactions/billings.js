import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Pagination,
  Divider,
  Typography,
  useTheme,
  Button,
  Grid,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Chip,
  TextField,
  IconButton,
  Modal,
  Select,
  MenuItem,
  List,
  ListItem,
  DialogTitle,
  Dialog,
  Popover
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { get } from 'lodash';
import InfoIcon from '@mui/icons-material/Info';
import PerfectScrollbar from 'react-perfect-scrollbar';
// import { getPayOutLists } from '../../graphQL/payouts';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { blue } from '@mui/material/colors';

const emails = ['username@gmail.com', 'user02@gmail.com'];

function SimpleDialog({ status }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <div>
      <IconButton
        disabled={!(status === 'INITIALIZED' || status === 'FAILED')}
        onClick={handleClick}
      >
        <AddIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <List sx={{ pt: 0 }}>
          {status === 'FAILED' && (
            <ListItem autoFocus button onClick={handleClose}>
              RE-INITIATE
            </ListItem>
          )}
          {status === 'INITIALIZED' && (
            <ListItem autoFocus button onClick={handleClose}>
              COMPLETE
            </ListItem>
          )}
          <ListItem autoFocus button onClick={handleClose}>
            CANCEL
          </ListItem>
        </List>
      </Popover>
    </div>
  );
}

const payouts = [
  {
    id: 'TR-001',
    cpo: {
      name: 'BESCOM'
    },
    cpoAmount: '4500',
    applicationFees: '500',
    createdAt: '22/12/2022',
    updatedAt: '22/12/2022',
    status: 'COMPLETED',
    eta: '02/01/2023',
    unitsConsumed: '500',
    transferTo: 'ACC-5400044994494',
    transferId: 'TR_ID-001456',
    transferAmount: '4500'
  },
  {
    id: 'TR-001',
    cpo: {
      name: 'BESCOM'
    },
    cpoAmount: '4500',
    applicationFees: '500',
    createdAt: '22/12/2022',
    updatedAt: '22/12/2022',
    status: 'INITIALIZED',
    eta: '02/01/2023',
    unitsConsumed: '500',
    transferTo: 'ACC-5400044994494',
    transferId: 'TR_ID-001456',
    transferAmount: '4500'
  },
  {
    id: 'TR-001',
    cpo: {
      name: 'BESCOM'
    },
    cpoAmount: '4500',
    applicationFees: '500',
    createdAt: '22/12/2022',
    updatedAt: '22/12/2022',
    status: 'CREATED',
    eta: '02/01/2023',
    unitsConsumed: '500',
    transferTo: 'ACC-5400044994494',
    transferId: 'TR_ID-001456',
    transferAmount: '4500'
  },
  {
    id: 'TR-001',
    cpo: {
      name: 'BESCOM'
    },
    cpoAmount: '4500',
    applicationFees: '500',
    createdAt: '22/12/2022',
    updatedAt: '22/12/2022',
    status: 'FAILED',
    eta: '02/01/2023',
    unitsConsumed: '500',
    transferTo: 'ACC-5400044994494',
    transferId: 'TR_ID-001456',
    transferAmount: '4500'
  },
  {
    id: 'TR-001',
    cpo: {
      name: 'BESCOM'
    },
    cpoAmount: '4500',
    applicationFees: '500',
    createdAt: '22/12/2022',
    updatedAt: '22/12/2022',
    status: 'CANCELLED',
    eta: '02/01/2023',
    unitsConsumed: '500',
    transferTo: 'ACC-5400044994494',
    transferId: 'TR_ID-001456',
    transferAmount: '4500'
  }
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    fontSize: '10px'
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '13px'
  }
}));

const getStatusChip = (status) => {
  switch (status) {
    case 'INITIALIZED':
      return (
        <Chip
          sx={{ width: '85px' }}
          color="warning"
          size="small"
          label="Initiated"
        />
      );
    case 'CREATED':
      return (
        <Chip
          sx={{ width: '85px' }}
          color="primary"
          size="small"
          label="Created"
        />
      );
    case 'FAILED':
      return (
        <Chip
          color="error"
          sx={{ width: '85px' }}
          size="small"
          label="Failed"
        />
      );
    case 'COMPLETED':
      return (
        <Chip
          sx={{ width: '85px' }}
          color="success"
          size="small"
          label="Completed"
        />
      );
    case 'CANCELLED':
      return <Chip sx={{ width: '85px' }} size="small" label="Cancelled" />;
    default:
      return <Chip sx={{ width: '85px' }} size="small" label="--" />;
  }
};

const Billing = ({ cpoId }) => {
  return (
    <Card>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell align="left" sx={{ paddingX: 1 }}>
              ID
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ paddingX: 1 }}>
              CPO
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ paddingX: 1 }}>
              ETA
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ paddingX: 1 }}>
              Units (kw)
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ paddingX: 1 }}>
              Total (₹)
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ paddingX: 1 }}>
              CPO (₹)
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ paddingX: 1 }}>
              Aggr (₹)
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ paddingX: 1 }}>
              Transferred (₹)
            </StyledTableCell>

            <StyledTableCell align="left" sx={{ paddingX: 1 }}>
              status
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ paddingX: 1 }}>
              Actions
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payouts.map((item) => {
            return (
              <TableRow key={item.id}>
                <StyledTableCell align="left" sx={{ paddingX: 1 }}>
                  {item.id}
                </StyledTableCell>
                <StyledTableCell align="left" sx={{ paddingX: 1 }}>
                  {item.cpo.name}
                </StyledTableCell>
                <StyledTableCell align="left" sx={{ paddingX: 1 }}>
                  {item.eta}
                </StyledTableCell>
                <StyledTableCell align="left" sx={{ paddingX: 1 }}>
                  {item.unitsConsumed}
                </StyledTableCell>
                <StyledTableCell align="left" sx={{ paddingX: 1 }}>
                  {Number(item.cpoAmount) + Number(item.applicationFees)}
                </StyledTableCell>
                <StyledTableCell align="left" sx={{ paddingX: 1 }}>
                  {item.cpoAmount}
                </StyledTableCell>
                <StyledTableCell align="left" sx={{ paddingX: 1 }}>
                  {item.applicationFees}
                </StyledTableCell>
                <StyledTableCell align="left" sx={{ paddingX: 1 }}>
                  {item.transferAmount}
                </StyledTableCell>
                <StyledTableCell align="left" sx={{ paddingX: 1 }}>
                  {getStatusChip(item.status)}
                </StyledTableCell>
                <StyledTableCell align="left" sx={{ paddingX: 1 }}>
                  <SimpleDialog status={item.status} />
                </StyledTableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Card>
        <CardContent
          sx={{ float: 'right', display: 'flex', flexDirection: 'row' }}
        >
          <span style={{ padding: '4px' }}> Page : </span>
          <Pagination
            count={get(payouts, 'Reservations.pagination.totalPages', 1)}
            showFirstButton={get(
              payouts,
              'Reservations.pagination.hasPrevPage',
              false
            )}
            showLastButton={get(
              payouts,
              'Reservations.pagination.hasNextPage',
              false
            )}
            onChange={(e, page) => {
              handlePagination(page);
            }}
          />
        </CardContent>
      </Card>
    </Card>
  );
};

export default Billing;
