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
import { TopUpCorporateWallet } from '../../../graphQL/corporate/wallet';
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

const UpdateMasterWallet = ({ open, setOpen, user, corpId, callBack }) => {
  const [amount, setAmount] = useState();
  const [userId, setUserId] = useState();
  const [paymentLink, setPaymentLink] = useState();

  const { topUpCorporateWalletResponse, topUpCorporateWallet } =
    TopUpCorporateWallet();

  const handleSubmit = () => {
    const payload = {
      corpId,
      amount: Number(amount),
      userId: userId
    };
    topUpCorporateWallet(payload);
  };

  useEffect(() => {
    if (topUpCorporateWalletResponse) {
      setPaymentLink(
        get(
          topUpCorporateWalletResponse,
          'topUpCorporateWallet.data.paymentLink'
        )
      );
    }
  }, [topUpCorporateWalletResponse]);

  useEffect(() => {
    const id = getCookie({ cname: 'uid', fromServer: false });
    setUserId(id);
  }, []);

  useEffect(() => {
    if (!open) {
      setPaymentLink();
      setAmount();
    }
  }, [open]);

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
          width: '500px',
          maxHeight: '400px',
          overflowY: 'scroll'
        }}
      >
        <Card>
          <CardHeader title="Recharge Master Wallet" sx={{ padding: '15px' }} />
          <CardContent sx={{ padding: '15px' }}>
            {!paymentLink && (
              <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
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
                    Add Amount
                  </Button>
                </Grid>
              </Grid>
            )}
            {paymentLink && (
              <>
                <p> Amount : {amount} </p>
                <p>
                  Click here to
                  <a
                    rel="noreferrer"
                    href={paymentLink}
                    target="_blank"
                    style={{
                      fontWeight: 'bold',
                      marginRight: '5px',
                      marginLeft: '5px'
                    }}
                  >
                    Recharge
                  </a>
                  your wallet
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default WithUserCtx(UpdateMasterWallet);
