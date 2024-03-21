import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CardHeader,
  Chip,
  Button,
  TextField,
  ButtonGroup,
  Pagination
} from '@mui/material';

import PerfectScrollbar from 'react-perfect-scrollbar';

const data = [
  {
    id: 'CRGO1',
    name: 'Kumar',
    mobile: '9030484840',
    email: 'user@envy.com',
    chasis: 'CC23455559595',
    wallet: '₹ 150',
    make: 'TATA TIGOR',
    active: true
  },
  {
    id: 'CRGO2',
    name: 'Kumar',
    mobile: '9030484840',
    email: 'user@envy.com',
    chasis: 'CC23455559595',
    wallet: '₹ 150',
    make: 'TATA TIGOR',
    active: false
  },
  {
    id: 'CRGO3',
    name: 'Kumar',
    mobile: '9030484840',
    email: 'user@envy.com',
    chasis: 'CC23455559595',
    wallet: '₹ 150',
    make: 'TATA TIGOR',
    active: true
  },
  {
    id: 'CRGO4',
    name: 'Kumar',
    mobile: '9030484840',
    email: 'user@envy.com',
    chasis: 'CC23455559595',
    wallet: '₹ 150',
    make: 'TATA TIGOR',
    active: false
  },
  {
    id: 'CRGO5',
    name: 'Kumar',
    mobile: '9030484840',
    email: 'user@envy.com',
    chasis: 'CC23455559595',
    wallet: '₹ 150',
    make: 'TATA TIGOR',
    active: true
  },
  {
    id: 'CRGO6',
    name: 'Kumar',
    mobile: '9030484840',
    email: 'user@envy.com',
    chasis: 'CC23455559595',
    wallet: '₹ 150',
    make: 'TATA TIGOR',
    active: false
  },
  {
    id: 'CRGO7',
    name: 'Kumar',
    mobile: '9030484840',
    email: 'user@envy.com',
    chasis: 'CC23455559595',
    wallet: '₹ 150',
    make: 'TATA TIGOR',
    active: true
  },
  {
    id: 'CRGO8',
    name: 'Kumar',
    mobile: '9030484840',
    email: 'user@envy.com',
    chasis: 'CC23455559595',
    wallet: '₹ 150',
    make: 'TATA TIGOR',
    active: false
  }
];

const HighLight = ({
  label,
  value,
  valueStyle = {},
  labelStyle = {},
  textSecondaryLabel
}) => {
  return (
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
        <Typography color="textPrimary" variant="h4" sx={valueStyle}>
          {value}
        </Typography>
        {textSecondaryLabel && (
          <Typography color="textSecondary" variant="caption">
            {textSecondaryLabel}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const Metrics = ({
  disableAddButton,
  drivers,
  pagination,
  onPagination,
  corporate
}) => {
  const [list, setList] = useState([]);

  const handlePagination = (page) => {
    onPagination(page);
  };

  return (
    <Grid container spacing={3}>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <HighLight
          label={'Name'}
          value={corporate.name}
          textSecondaryLabel={`Partner ID : ${corporate.id}`}
        />
      </Grid>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <HighLight
          label={'Wallet'}
          value={'₹  50,000'}
          textSecondaryLabel={' Total Master Wallet Balance'}
        />
      </Grid>
      <Grid item xl={3} lg={3} sm={6} xs={12}>
        <HighLight
          label={'Fleet Count'}
          value={'600'}
          textSecondaryLabel={'No of Vehicles Onboarded'}
        />
      </Grid>
      <Grid item xl={3} lg={3} sm={6} xs={12}>
        <HighLight
          label={'Active'}
          value={'450'}
          textSecondaryLabel={'No of Active Vehicles'}
        />
      </Grid>

      <Grid item lg={12} md={12} xl={9} xs={12}>
        <Card>
          <CardHeader
            sx={{ padding: '15px 20px' }}
            subheader={'Fleet Drivers'}
            action={
              <Box>
                <TextField
                  fullWidth
                  placeholder="Search"
                  name="stationName"
                  onChange={() => {}}
                  variant="standard"
                  size="small"
                  height="34px"
                  color="success"
                  sx={{
                    width: '220px',
                    marginRight: 5,
                    marginTop: '2px'
                  }}
                />
                {!disableAddButton && (
                  <Button size="small" color="success" variant="contained">
                    Add New
                  </Button>
                )}
              </Box>
            }
          />
          <PerfectScrollbar>
            <Box>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Mobile</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Chasis No</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Wallet</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {drivers.map((item) => {
                    return (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.user.name}</TableCell>
                        <TableCell>{item.user.phone}</TableCell>
                        <TableCell>{item.user.email}</TableCell>
                        <TableCell>{item.chassis}</TableCell>
                        <TableCell>{item.model}</TableCell>
                        <TableCell>₹ 150</TableCell>

                        <TableCell>
                          <Chip
                            label={`${
                              item.status === 'ACTIVE'
                                ? 'active'
                                : 'deactivated'
                            } `}
                            color={`${
                              item.status === 'ACTIVE' ? 'success' : 'default'
                            }`}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            key="three"
                            size="small"
                            aria-label="small button group"
                            sx={{ marginRight: '3px' }}
                            variant="contained"
                          >
                            View More
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
            <Card>
              <CardContent
                sx={{ float: 'right', display: 'flex', flexDirection: 'row' }}
              >
                <span style={{ padding: '4px' }}> Page : </span>
                <Pagination
                  count={get(pagination, 'totalPages', 1)}
                  showFirstButton={get(pagination, 'hasPrevPage', false)}
                  showLastButton={get(pagination, 'hasNextPage', false)}
                  onChange={(e, page) => {
                    handlePagination(page);
                  }}
                />
              </CardContent>
            </Card>
          </PerfectScrollbar>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Metrics;
