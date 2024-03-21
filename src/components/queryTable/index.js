import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Modal,
  TableContainer,
  Paper,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "3px",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};



const TableBuilder = ({ item, getQueryValue }) => {
  if (!item) {
    return null;
  }
  return (
    <React.Fragment>
      {item &&
        Object.keys(item).map((keyName, index) => (
          <TableRow key={index}>
            <TableCell>
              <b style={{ textTransform: "capitalize" }}>{keyName}</b>
            </TableCell>
            <TableCell>{getQueryValue(keyName, item)}</TableCell>
          </TableRow>
        ))}
    </React.Fragment>
  );
};

const getQueryValue = (keyName, queryObject) => {
  const value = queryObject[keyName];

  if (typeof value === "object") {
    return value.propertyToDisplay;
  }

  return value;
};

const QueryTable = ({
  open,
  handleClose,
  queryObject,
  getQueryValue,
  getUserName,
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          ...style,
          width: "800px",
          maxHeight: "800px",
          overflowY: "scroll",
        }}
      >
        <h3> {getUserName}</h3>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 15,
            top: 15,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon sx={{ color: 'black'}} />
        </IconButton>
        <br></br>
        <TableContainer component={Paper}>
          <Table aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Query</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queryObject &&
                Object.keys(queryObject).map((keyName, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <b style={{ textTransform: "capitalize" }}>{keyName}</b>
                    </TableCell>
                    <TableCell>{getQueryValue(keyName, queryObject)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
};

export default QueryTable;

export { TableBuilder, getQueryValue };
