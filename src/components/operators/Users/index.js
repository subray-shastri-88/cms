import React from 'react';
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
  ButtonGroup
} from '@mui/material';

const data = [
  {
    id: 'Admin-1',
    name: 'James',
    mobile: '9030484840',
    email: 'james@bescom.com',
    role: 'Owner',
    active: true
  },
  {
    id: 'Admin-2',
    name: 'Tom',
    mobile: '9030484840',
    email: 'tom@bescom.com',
    role: 'Manager',
    active: true
  },
  {
    id: 'Admin-3',
    name: 'Nick',
    mobile: '9030484840',
    email: 'nick@bescom.com',
    role: 'Guest',
    active: true
  },
  {
    id: 'Admin-1',
    name: 'Kumar',
    mobile: '9030484840',
    email: 'kumar@bescom.com',
    role: 'Owner',
    active: true
  }
];

const UserList = ({ disableAddButton }) => (
  <Box>
    <Table sx={{ minWidth: 650 }}>
      <TableHead>
        <TableRow>
          <TableCell>Id</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Mobile</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Role</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Edit</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item) => {
          return (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.mobile}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.role}</TableCell>{' '}
              <TableCell>
                <Chip
                  label={`${item.active ? 'active' : 'deactivated'} `}
                  color={`${item.active ? 'success' : 'default'}`}
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
                  edit
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </Box>
);

export default UserList;
