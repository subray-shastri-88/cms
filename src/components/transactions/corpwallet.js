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
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import PerfectScrollbar from 'react-perfect-scrollbar';

const data = [
  {
    id: 'TransO1',
    name: 'Envy',
    amount: '₹ 1.5L'
  },
  {
    id: 'TransO1',
    name: 'Envy',
    amount: '₹ 1.5L'
  },
  {
    id: 'TransO1',
    name: 'Envy',
    amount: '₹ 1.5L'
  }
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    fontSize: '10px'
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '13px'
  }
}));

const CorpWallet = () => {
  return (
    <React.Fragment>
      <Box>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ paddingX: 1 }}>ID</StyledTableCell>
              <StyledTableCell sx={{ paddingX: 1 }}>Name</StyledTableCell>
              <StyledTableCell sx={{ paddingX: 1 }}>Amount</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => {
              return (
                <TableRow key={item.id}>
                  <StyledTableCell sx={{ paddingX: 1 }}>
                    {item.id}
                  </StyledTableCell>
                  <StyledTableCell sx={{ paddingX: 1 }}>
                    {item.name}
                  </StyledTableCell>
                  <StyledTableCell sx={{ paddingX: 1 }}>
                    {item.amount}
                  </StyledTableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </React.Fragment>
  );
};

export default CorpWallet;
