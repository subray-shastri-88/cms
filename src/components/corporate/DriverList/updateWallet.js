import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  Box,
  Modal,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import {
  TransferToDriverWallet,
  RetrieveFromDriverWallet
} from '../../../graphQL/corporate/wallet';
import { WithUserCtx } from '../../../contexts/userContext';
import { getCookie } from '../../../utils/jsUtils';

const style = {
  position: 'absolute',
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: '3px',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3
};

const UpdateWallet = ({ driverId, open, setOpen, user, corpId, callBack }) => {
  const [action, setAction] = useState('Add');
  const [userId, setUserId] = useState();
  const [amount, setAmount] = useState();
  const { driverToWalletResponse, transferToDriverWallet } =
    TransferToDriverWallet();
  const { retrieveFromDriverWallet, retrieveFromDriverResponse } =
    RetrieveFromDriverWallet();

  const handleSubmit = () => {
    const payload = {
      corpId,
      driverId: driverId,
      amount: Number(amount),
      currentUserId: userId
    };
    if (action === 'Add') {
      transferToDriverWallet(payload);
    } else {
      retrieveFromDriverWallet(payload);
    }
  };

  useEffect(() => {
    const id = getCookie({ cname: 'uid', fromServer: false });
    setUserId(id);
  }, []);

  useEffect(() => {
    if (retrieveFromDriverResponse || driverToWalletResponse) {
      setOpen(false);
      callBack(1);
      setAmount();
    }
  }, [driverToWalletResponse, retrieveFromDriverResponse]);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box
        sx={{
          ...style,
          width: '800px',
          maxHeight: '400px',
          overflowY: 'scroll'
        }}
      >
        <Card>
          <CardHeader subheader="Manage The Driver Wallet" />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Action Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Action Type"
                    name="action"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                  >
                    <MenuItem value="Add">Add Money</MenuItem>
                    <MenuItem value="Withdraw">Withdraw Money</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Amount"
                  name="amount"
                  required
                  variant="outlined"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Button
                  key="two"
                  color="primary"
                  variant="contained"
                  sx={{ width: '100%' }}
                  disabled={!amount}
                  onClick={handleSubmit}
                >
                  Update Wallet
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default WithUserCtx(UpdateWallet);
