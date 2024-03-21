import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@mui/material';
import { WithCpoCtx } from '../../../contexts/cpoContext';
import { addNewMachineMaker } from '../../../graphQL/machines/makes';
import { useMutation } from '@apollo/client';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: '3px',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3
};

const NewManufacturer = ({ header }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const [addNewMachineManufacturer, { data, loading, error }] = useMutation(
    addNewMachineMaker,
    {
      variables: {
        name: null
      }
    }
  );

  const onFormSubmit = () => {
    addNewMachineManufacturer({
      variables: {
        name: name
      }
    });
  };

  useEffect(() => {
    if (data) {
      setName('');
      setOpen(false);
    }
  }, [data]);

  return (
    <React.Fragment>
      <Button
        color="primary"
        size="small"
        variant="contained"
        onClick={() => setOpen(true)}
      >
        New Manufacturer
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            ...style,
            width: '900px',
            maxHeight: '900px',
            overflowY: 'scroll'
          }}
        >
          <Card>
            <CardHeader title="Add New Manufacturer" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={8} xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    onChange={(e) => setName(e.target.value)}
                    required
                    value={name}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={4}
                  xs={12}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Button
                    disabled={!name}
                    color="primary"
                    variant="contained"
                    onClick={onFormSubmit}
                    size="large"
                    style={{ width: '100%', height: '100%' }}
                  >
                    Add New Manufacturer
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default WithCpoCtx(NewManufacturer);
