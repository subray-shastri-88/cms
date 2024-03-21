import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography
} from '@mui/material';
import { useLazyQuery, useQuery } from '@apollo/client';
import { getPortTypes } from '../../graphQL/machines/plugs';
import { getTariff } from '../../graphQL/tariff';
import Ring from '../ui/Loader/Ring';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TariffTable from './table';

const TariffList = ({ cpoId }) => {
  const { data, loading, refetch } = useQuery(getPortTypes);
  const [getTariffPlans, { data: tariffData }] = useLazyQuery(getTariff, {
    variables: {
      filter: {
        cpoId: cpoId
      }
    }
  });
  const [portTypes, setPortTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const [plugToEdit, setPlugToEdit] = useState('');
  const [tariffList, setTariffList] = useState([]);

  useEffect(() => {
    getTariffPlans({
      variables: {
        filter: {
          cpoId: cpoId
        }
      }
    });
  }, [cpoId, getTariffPlans]);

  useEffect(() => {
    setTariffList(get(tariffData, 'Tariffs', []));
  }, [tariffData]);

  useEffect(() => {
    setPortTypes(get(data, 'PortTypes', []));
  }, [data]);

  useEffect(() => {
    if (!open) {
      setPlugToEdit();
      refetch();
    }
  }, [open]);

  useEffect(() => {
    if (plugToEdit) {
      setOpen(true);
    }
  }, [plugToEdit]);

  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let stamp = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + stamp;
    return strTime;
  };
  const getDate = (item) => {
    if (!item) {
      return '--';
    }
    const date = new Date(item * 1);
    return (
      date.getDate() +
      '/' +
      (date.getMonth() + 1) +
      '/' +
      date.getFullYear() +
      ' - ' +
      formatTime(date)
    );
  };

  return (
    <Card>
      <CardContent sx={{ padding: '0px', paddingBottom: '0px !important' }}>
        {loading && <Ring />}
        {tariffList.map((item, index) => (
          <Accordion
            key={index}
            sx={{ marginTop: '3px', marginBottom: '0px !important' }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{item.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid
                container
                spacing={3}
                sx={{
                  marginBottom: '20px'
                }}
              >
                <Grid item md={4} xs={12}>
                  <Typography variant="subtitle2">Tariff Type :</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {item.isDefault ? 'default' : 'Custom'}
                  </Typography>
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography variant="subtitle2">Start Date : </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {getDate(item.startDate)}
                  </Typography>
                </Grid>
                <Grid item md={4} xs={12}>
                  <Typography variant="subtitle2">End Date : </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    {getDate(item.endDate)}
                  </Typography>
                </Grid>
              </Grid>
              <TariffTable portTypes={item.ports} />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '20px'
                }}
              >
                <Button disabled variant="contained">
                  Edit
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </CardContent>
    </Card>
  );
};

export default TariffList;
