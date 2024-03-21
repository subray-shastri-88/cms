import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  Box,
  Container,
  Modal,
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
  Pagination,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import { getFleetVehicles } from '../../../graphQL/corporate';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useQuery } from '@apollo/client';
import { CreateFleetVehicle } from '../../../graphQL/corporate/fleet';
import Fleet from './getFleet';
import AddNewFleet from './addFleet';

const FleetList = ({ corpId, fleetType }) => {
  const { fleetList, pagination, handlePagination } = Fleet({ corpId });
  const { response, createFleetVehicle } = CreateFleetVehicle();

  useEffect(() => {
    if (response) {
      handlePagination(1);
    }
  }, [response]);

  return (
    <Container maxWidth={'xl'}>
      <Card sx={{ position: 'relative', mx: '25px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography sx={{ m: 3 }} variant="h4">
            Fleet Management
          </Typography>
        </div>
        {fleetType && (
          <AddNewFleet
            corpId={corpId}
            fleetType={fleetType}
            createFleetVehicle={createFleetVehicle}
            forceClose={!!response}
          />
        )}
      </Card>
      <Card sx={{ position: 'relative', mx: '25px', my: '10px' }}>
        <PerfectScrollbar>
          <Box>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Reg No.</TableCell>
                  <TableCell>Chassis</TableCell>
                  <TableCell>Engine No.</TableCell>
                  <TableCell>Vin</TableCell>
                  <TableCell>Model</TableCell>
                  <TableCell>Make</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fleetList.map(
                  ({
                    id,
                    registrationNumber,
                    chassis,
                    engineNumber,
                    vinNumber,
                    model,
                    manufacturer,
                    status
                  }) => {
                    return (
                      <TableRow key={id}>
                        <TableCell>{id}</TableCell>
                        <TableCell>{registrationNumber}</TableCell>
                        <TableCell>{chassis}</TableCell>
                        <TableCell>{engineNumber}</TableCell>
                        <TableCell>{vinNumber}</TableCell>
                        <TableCell>{get(model, 'name')}</TableCell>
                        <TableCell>{get(manufacturer, 'name')}</TableCell>
                        <TableCell>
                          <Chip
                            label={`${
                              status === 'ACTIVE' ? 'active' : 'deactivated'
                            } `}
                            color={`${
                              status === 'ACTIVE' ? 'success' : 'default'
                            }`}
                            size="small"
                            variant="filled"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
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
    </Container>
  );
};

export default FleetList;
