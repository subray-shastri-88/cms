import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import {
  Box,
  Button,
  Modal,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Chip,
  Select,
  Checkbox,
  ListItemText,
  MenuItem,
  InputLabel,
  FormControl,
  outlinedInput,
  Autocomplete
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ErrorBox from '../ui/ErrorBox/ErrorBox';
import { WithCpoCtx } from '../../contexts/cpoContext';
import { CreateRfId ,LinkRFIDToCorporate } from '../../graphQL/rfid';
import { corporatesList } from '../../graphQL/corporate';
import { useLazyQuery, useMutation ,useQuery } from '@apollo/client';

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

const AssignRfidToCorporate = ({ loadData, rfId , refetchCorp}) => {
  const [cpo, setCpo] = useState('');
  const [open, setOpen] = useState(false);
  const [corporateList, setCorporateList] = useState([]);
  const [corporate, setCorporate] = useState();
  const [error, setError] = useState(false);
  const { linkRFIDToCorporate, linkRFIDToCorporateRes } = LinkRFIDToCorporate();
  const { createRfIds, createRfIdResponse } = CreateRfId();
  const [row , setRow] = useState();

  const { data: corpData } = useQuery(corporatesList, {
    variables: {
      pagination: {
        page: 1,
        limit: 1000
      }
    }
  });

  useEffect(() => {
    const lists = get(corpData, 'Corporates.docs', []);

    let mappedData = lists.map((item) => {
      return { label: item.name || '', name: item.name || '', ...item };
    });
    mappedData = mappedData.filter((item) => item.name);

    setCorporateList(mappedData);
  }, [corpData]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log(corporate , rfId)

  const onFormSubmit = () => {
    linkRFIDToCorporate({ corporateId: corporate.id, idTag: rfId });
  };

  const handleCorporateChange = (value) => {
    setCorporate(value);
  };

  useEffect(() => {
    if (linkRFIDToCorporateRes) {
      setOpen(false);
      refetchCorp();
      loadData();
    }
  }, [linkRFIDToCorporateRes]);

console.log(linkRFIDToCorporateRes);

  return (
    <React.Fragment>
      <Chip
        color="primary"
        label="Assign Corporate"
        onDelete={handleOpen}
        deleteIcon={<AddCircleIcon />}
      />
      <Modal
        open={open}
        onClose={handleClose}
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
          {error && <ErrorBox message="Please Enter all fields" />}
          <Card>
            <CardHeader subheader="Assign RFID to Corporate" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    fullWidth
                    id="combo-box-demo"
                    options={corporateList || []}
                    onChange={(event, newValue) =>
                      handleCorporateChange(newValue)
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Select Partner" />
                    )}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="RFID"
                    name="rfid"
                    required
                    value={rfId}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Button
            color="primary"
            variant="contained"
            sx={{ marginTop: 3, float: 'right' }}
            onClick={onFormSubmit}
            // disabled={!corporate?.id}
          >
            Assign
          </Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default WithCpoCtx(AssignRfidToCorporate);
