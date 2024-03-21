import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  Divider,
  Grid,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  useTheme,
  Autocomplete,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  FilledInput,
  Tab
} from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { getPortTypes } from '../../graphQL/machines/plugs';
import { getTariff } from '../../graphQL/tariff';
import Ring from '../ui/Loader/Ring';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const TariffTable = ({ portTypes }) => {
  const [tariffList, setTariffList] = useState([]);
  useState(() => {
    const list = [];
    portTypes.map((item) => {
      item.config.map((conf) => {
        list.push({
          portType: item.portType,
          power: conf.powerRating,
          powerType: conf.powerType,
          pricePerUnit: conf.pricePerUnit
        });
      });
    });
    setTariffList(list);
  }, [portTypes]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Port Name</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Power</TableCell>
          <TableCell>Price Per Uint</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tariffList.map((port, index) => (
          <TableRow key={index}>
            <TableCell>{port.portType}</TableCell>
            <TableCell>{port.powerType}</TableCell>
            <TableCell>{port.power} KW</TableCell>
            <TableCell>₹ {port.pricePerUnit} /-</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TariffTable;
