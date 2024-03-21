import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { get } from 'lodash';
import {
  Box,
  Container,
  Card,
  Typography,
  Grid,
  CardHeader,
  IconButton,
  Chip,
  Modal
} from '@mui/material';
import { DashboardLayout } from '../../../../components/dashboard-layout';
import { WithCpoCtx } from '../../../../contexts/cpoContext';
import { useLazyQuery, useMutation } from '@apollo/client';
import { getDriverDetails, updateDriver } from '../../../../graphQL/corporate';
import Bookings from '../../../../components/bookings';
import EditIcon from '@mui/icons-material/Edit';
import AdjustIcon from '@mui/icons-material/Adjust';
import {
  HighLight,
  UpdateDriverModal,
  UpdateWallet
} from '../../../../components/corporate/DriverList';
import Transactions from '../../../../components/wallet/transactions';

const Drivers = () => {
  const router = useRouter();
  const { driverId } = router.query;
  const [driver, setDriver] = useState();
  const [open, setOpen] = useState(false);
  const [walletModal, setWalletModal] = useState(false);

  const [getDriverData, { data: driverData, refetch }] = useLazyQuery(
    getDriverDetails,
    {
      variables: {
        driverId: null
      }
    }
  );

  const callGetDriverData = useCallback(() => {
    if (driverId) {
      getDriverData({
        variables: {
          driverId: driverId
        }
      });
    }
  }, [driverId, getDriverData]);

  const refetchDriverData = () => {
    refetch({
      variables: {
        driverId: driverId
      }
    });
  };

  useEffect(() => {
    if (driverId) {
      callGetDriverData({
        variables: {
          driverId: driverId
        }
      });
    }
  }, [driverId, callGetDriverData]);

  useEffect(() => {
    const data = get(driverData, 'Driver');
    setDriver(data);
  }, [driverData]);

  const [
    updateDriverData,
    { data: updateDriverDataResponse, loading, error: err }
  ] = useMutation(updateDriver, {
    variables: {
      driverId: driverId,
      input: {
        chassis: null,
        model: null,
        status: null
      }
    }
  });

  const handleUpdateDriver = ({ status }) => {
    let fields = {
      chassis: driver.chassis,
      model: driver.model
    };
    const newStatus = status === 'ACTIVE' ? 'IN_ACTIVE' : 'ACTIVE';
    fields.status = newStatus;
    updateDriverData({
      variables: {
        driverId: driverId,
        input: fields
      }
    });
  };

  useEffect(() => {
    if (updateDriverDataResponse) {
      refetchDriverData();
    }
  }, [updateDriverDataResponse]);

  const getStatusChip = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <Chip color="success" label="Active" />;
      case 'IN_ACTIVE':
        return <Chip color="error" label="Deactivated" />;
      default:
        return <Chip label="--" />;
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1
      }}
    >
      <Container maxWidth={'xl'}>
        <Card
          sx={{
            position: 'relative',
            marginTop: '30px',
            paddingTop: '20px'
          }}
        >
          <CardHeader
            title={`Driver DashBoard`}
            action={
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center'
                }}
              >
                {getStatusChip(driver?.status)}
                <IconButton
                  aria-label="edit"
                  onClick={() =>
                    handleUpdateDriver({
                      id: driver.id,
                      status: driver.status
                    })
                  }
                >
                  <AdjustIcon />
                </IconButton>
              </div>
            }
          />
          <Grid container spacing={3} sx={{ paddingX: '15px' }}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <HighLight
                label={'Name'}
                value={driver?.user?.name || '--'}
                textSecondaryLabel={`Driver ID : ${driver?.id || ''}`}
              />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <HighLight
                label={'Contact'}
                value={driver?.user?.phone || '--'}
                textSecondaryLabel={`Email: ${driver?.user?.email || ''}`}
              />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <HighLight
                label={'Chassis'}
                value={driver?.chassis || '--'}
                textSecondaryLabel={`Model: ${driver?.model || ''}`}
                actionItem={
                  <IconButton
                    size="small"
                    onClick={() => setOpen(true)}
                    aria-label="edit"
                  >
                    <EditIcon size="small" />
                  </IconButton>
                }
              />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <HighLight
                label={'Wallet'}
                value={`₹ ${driver?.user?.wallet?.credit || 0}`}
                textSecondaryLabel={`Reserved Amount: ₹ ${
                  driver?.user?.wallet?.reserved || 0
                } `}
                actionItem={
                  <IconButton
                    onClick={() => setWalletModal(true)}
                    aria-label="edit"
                    size="small"
                  >
                    <EditIcon size="small" />
                  </IconButton>
                }
              />
            </Grid>
          </Grid>
          <Grid container spacing={1} sx={{ marginTop: '20px' }}>
            <Grid item xl={4} mds={4} sm={12}>
              <Card sx={{ position: 'relative' }}>
                <CardHeader subheader="Wallet Transactions" />
                <Transactions
                  transactions={get(driver, 'user.wallet.transactions', [])}
                />
              </Card>
            </Grid>
            <Grid item xl={8} mds={8} sm={12}>
              {driverId && (
                <Card>
                  <CardHeader subheader="Reservations" />
                  <Bookings
                    status={[
                      'RESERVED',
                      'HOLD',
                      'CANCELED',
                      'COMPLETED',
                      'RUNNING'
                    ]}
                    userId={driverId}
                  />
                </Card>
              )}
            </Grid>
          </Grid>
        </Card>
      </Container>
      <UpdateDriverModal
        open={open}
        setOpen={setOpen}
        driver={driver}
        callBack={refetchDriverData}
      />
      <UpdateWallet
        open={walletModal}
        setOpen={setWalletModal}
        driver={driver}
        callBack={refetchDriverData}
      />
    </Box>
  );
};

const CorporatesPage = WithCpoCtx(Drivers);

CorporatesPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CorporatesPage;
