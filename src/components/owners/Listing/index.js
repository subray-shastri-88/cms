import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
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
  Modal
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { owners } from './__mocks__/data';

const Listings = () => {
  return (
    <React.Fragment>
      <Card sx={{ marginTop: '20px' }}>
        <PerfectScrollbar>
          <Box sx={{ minWidth: 1050 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Owner Name</TableCell>
                  <TableCell>Business Type</TableCell>
                  <TableCell>No of Stations</TableCell>
                  <TableCell>No of Machines</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {owners.map((item) => {
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.stations}</TableCell>
                      <TableCell>{item.machines}</TableCell>
                      <TableCell>{item.city}</TableCell>
                      <TableCell>
                        <IconButton aria-label="delete" size="large">
                          <InfoIcon fontSize="inherit" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
        {/* <TablePagination
        component="div"
        count={customers.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      /> */}
        {/* <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          position: 'fixed',
          top: '5%',
          left: '0',
          right: '0',
          width: '85vw',
          margin: 'auto',
          overflowY: 'scroll',
          height: '900px'
        }}
      >
        <Box sx={style}></Box>
      </Modal> */}
      </Card>
    </React.Fragment>
  );
};

export default Listings;
