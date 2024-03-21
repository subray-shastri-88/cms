import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  Grid,
  Table,
  TableBody,
  FormControl,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  TextField,
  IconButton,
  Modal,
  Pagination,
  TableContainer,
  Paper,
  ButtonGroup,
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material';
import { updateCorporate } from '../../../graphQL/corporate';
import InfoIcon from '@mui/icons-material/Info';
import PerfectScrollbar from 'react-perfect-scrollbar';
import QueryTable , {TableBuilder} from '../../queryTable';
import getQueryValue from "../../queryTable";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { toDate } from 'date-fns';

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
const Listings = ({ updateList, data, refetch, header, cpos, reloadCorps }) => {
  const defaultData = {
    name: "",
    cpo: "",
    city: "",
    line1: "",
    line2: "",
    state: "",
    zip: "",
    phone: "",
    reg: "",
    gst: "",
    email: "",
    type: "",
    contractStart: new Date(),
    contractEnd: new Date(),
    cpos: [],
  };

  const [createNewCorporate, { loading, error: err }] = useMutation(
    updateCorporate,
    {
      variables: {
        corporateId: null,
        input: {
          name: null,
          businessType: null,
          address: {
            line1: null,
            line2: null,
            city: null,
            state: null,
            zip: null,
            phone: null,
          },
          registrationNumber: null,
          gst: null,
          contractStartDate: null,
          contractEndDate: null,
          fleetType: null,
          email: null,
          phone: null,
        },
      },
    }
  );

  const [handleToggleCorpStatus, { data: toggleData }] = useMutation(
    updateCorporate,
    {
      variables: {
        corporateId: null,
        input: {
          status: null
        }
      },
    }
  );

  const [partnerData, setPartnerData] = useState(defaultData);
  const [row, setRow] = useState();
  const [error, setError] = useState(false);
  const handleChange = (event) => {
    setPartnerData({
      ...partnerData,
      [event.target.name]: event.target.value,
    });
  };
  const handleStartDate = (value) => {
    setPartnerData({
      ...partnerData,
      contractStart: value,
    });
  };
  const handleEndDate = (value) => {
    setPartnerData({
      ...partnerData,
      contractEnd: value,
    });
  };
  const handleCloseCorporate = () => {
    setPartnerData(defaultData);
    setOpenCorporate(false);
  };

  const checkIfAllFieldsAvailable = () => {
    const address =
      partnerData.line1 &&
      partnerData.line2 &&
      partnerData.city &&
      partnerData.state &&
      partnerData.zip &&
      partnerData.phone;
    const basic =
      partnerData.name &&
      partnerData.phone &&
      partnerData.reg &&
      partnerData.gst &&
      partnerData.contractStart &&
      partnerData.contractEnd &&
      partnerData.type &&
      partnerData.email;
    return address && basic;
  };
  const onFormSubmit = () => {
    createNewCorporate({
      variables: {
        corporateId: row.id,
        input: {
          address: {
            line1: partnerData.line1,
            line2: partnerData.line2,
            city: partnerData.city,
            state: partnerData.state,
            zip: partnerData.zip,
            phone: partnerData.phone,
          },
          name: partnerData.name,
          phone: partnerData.phone,
          registrationNumber: partnerData.reg,
          gst: partnerData.gst,
          contractStartDate: partnerData.contractStart,
          contractEndDate: partnerData.contractEnd,
          fleetType: partnerData.type,
          email: partnerData.email,
        },
      },
    });
    handleCloseCorporate();
    reloadCorps();
    refetch();
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Partner added successfully!",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    reloadCorps();
    refetch();
  }

  const toggleCorpStatus = (corporateId , status) => {
    const fields = {
      corporateId: corporateId,
      input: {
        status: status
      }
    };
    handleToggleCorpStatus({
      variables: fields,
    });
    reloadCorps();
    refetch();
  };

  const [corporateList, setCorporateList] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState({});
  const [openDetail, setOpenDetail] = useState(false);
  const [openCorporate, setOpenCorporate] = useState(false);

  const getBDate = (item) => {
    if (!item) {
      return "--";
    }
    const date = new Date(item);
    console.log(date)
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return (
      date.getDate() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getFullYear() +
      "   " +
      formattedHours +
      ":" +
      formattedMinutes +
      " " +
      ampm
    );
  };

  // const handleOpen = (item) => {
  //   setSelectedPartner(item);
  //   setOpen(true);
  // };
  const handleOpen = (item) => {
    setSelectedPartner(item);
    setOpenDetail(true);
    console.log(item , 'item');
    console.log(selectedPartner , 'part');  
  };
  const handleClose = () => {
    setSelectedPartner({});
    setOpenDetail(false);
  };

  console.log(selectedPartner , 'partner')

  const getUKeyValue = (mainKey, key) => {
    return selectedPartner[mainKey][key] || "--";
  };

  const getKeyValue = (key) => {
    const item = selectedPartner[key];
    switch (key) {
      case "address": {
        const { __typename, ...rest } = item;
        return (
          <TableBuilder
            item={rest}
            getQueryValue={(val) => getUKeyValue("address", val)}
          />
        );
      }
      case "wallet": {
        const { __typename, ...rest } = item;
        return (
          <TableBuilder
            item={rest}
            getQueryValue={(val) => getUKeyValue("wallet", val)}
          />
        );
      }
      case "contractEndDate":
      case "contractStartDate":
        return getBDate(item);
      default:
        return item || "--";
    }
  };

  const handlePagination = (page) => {
    refetch({
      pagination: {
        page: page,
        limit: 10
      }
    });
  };

  useEffect(() => {
    const lists = get(data, 'Corporates.docs', []);
    setCorporateList(lists);
    let mappedData = lists.map((item) => {
      return { label: item.name || '', name: item.name || '', ...item };
    });
    mappedData = mappedData.filter((item) => item.name);
    updateList(mappedData);
  }, [data]);

  const getBookingDate = (timestamp) => {
    if (!timestamp) {
      return '--';
    }
    const date = new Date(timestamp);
    return (
      date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
    );
  };

  // const getKeyValue = (key) => {
  //   const item = selectedPartner[key];
  //   switch (key) {
  //     case "contractStartDate":
  //       return getBookingDate(item);
  //     case "contractEndDate":
  //       return getBookingDate(item);
  //     case "address":
  //       return `${get(item, "address.line1", "")} ${get(
  //         item,
  //         "address.line2",
  //         ""
  //       )} ${get(item, "address.city", "")} ${get(
  //         item,
  //         "address.state",
  //         ""
  //       )}-${get(item, "address.zip", "")}`;
  //     default:
  //       return item;
  //   }
  // };

  // const getKeyValue = (key) => {
  //   const item = selectedPartner[key];
  //   switch (key) {
  //     case 'contractStartDate':
  //       return getBookingDate(item);
  //     case 'contractEndDate':
  //       return getBookingDate(item);
  //     case 'address':
  //       return `${get(item, 'address.line1', '')} ${get(
  //         item,
  //         'address.line2',
  //         ''
  //       )} ${get(item, 'address.city', '')} ${get(
  //         item,
  //         'address.state',
  //         ''
  //       )}-${get(item, 'address.zip', '')}`;
  //     default:
  //       return item;
  //   }
  // };

  const handleEditCorporate = (corporate) => {
    setPartnerData({
      name: corporate.name,
      cpo: corporate.cpo,
      reg: corporate.registrationNumber,
      gst: corporate.gst,
      contractStart: corporate.contractStartDate,
      contractEnd: corporate.contractEndDate,
      type: corporate.fleetType,
      email: corporate.email,
      phone: corporate.phone,
      line1: corporate.address.line1,
      line2: corporate.address.line2,
      city: corporate.address.city,
      state: corporate.address.state,
      zip: corporate.address.zip,
      isActive: corporate.status === "active",
    });
    setOpenCorporate(true);
  };

  // useEffect(()=>{
  //   if(!err){
  //     handleCloseCorporate()
  //   }
  // })
  return (
    <React.Fragment>
      <Card sx={{ marginTop: '0px', paddingY: '0px' }}>
        <PerfectScrollbar>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 1050 }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ padding: '15px !important' }}>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Fleet</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                  <TableCell>Edit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {corporateList.map((item) => {
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <a href={`/corporate/${item.id}`}> {item.id}</a>
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.fleetType}</TableCell>
                      <TableCell>
                        {getBookingDate(item.contractStartDate)}
                      </TableCell>
                      <TableCell>
                        {getBookingDate(item.contractEndDate)}
                      </TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.phone}</TableCell>
                      <TableCell>{item.address.city}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {setSelectedPartner(item); handleOpen(item); }}
                          aria-label="details"
                          size="large"
                        >
                          <InfoIcon fontSize="inherit" />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            item.status === "ACTIVE"
                              ? "Active"
                              : "Deactivated"
                          }
                          size="small"
                          variant="filled"
                          color={item.status === "ACTIVE" ? "success" : "error"}
                        />
                      </TableCell>
                      <TableCell align="left">
                        <ButtonGroup
                          size="small"
                          aria-label="small button group"
                          variant="text"
                        >
                          {!(item.status === 'ACTIVE') ? (
                            <Button
                              key="one"
                              color="success"
                              sx={{ width: "92px" }}
                              onClick={() => toggleCorpStatus(item.id, 'ACTIVE')}
                            >
                              Activate
                            </Button>
                          ) : (
                            <Button
                              key="one"
                              color="error"
                              sx={{ width: "92px" }}
                              onClick={() => toggleCorpStatus(item.id, 'IN_ACTIVE')}
                            >
                              Deactivate
                            </Button>
                          )}
                        </ButtonGroup>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => { handleEditCorporate(item); setRow(item) }}
                          aria-label="Edit"
                          size="small"
                        >
                          <ModeEditIcon fontSize="inherit" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </PerfectScrollbar>
      </Card>
      <Modal
        open={openCorporate}
        onClose={handleCloseCorporate}
        aria-labelledby="edit-corporate-modal-title"
        aria-describedby="edit-corporate-modal-description"
      // style={{ zIndex: 9999 }}
      >
        <Box
          sx={{
            ...style,
            width: "800px",
            maxHeight: "700px",
            overflowY: "scroll",
          }}
        >
          {error && <ErrorBox message="Please Enter all fields" />}
          <Card>
            <CardHeader subheader="Enter the Partner Details" title={header} />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    onChange={handleChange}
                    required
                    value={partnerData.name}
                    variant="outlined"
                    disabled
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">CPO</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Select CPO"
                      name="cpo"
                      onChange={handleChange}
                      value={partnerData.cpo}
                      key="Cpolist"
                      disabled
                    >
                      {cpos &&
                        cpos.map((item) => (
                          <MenuItem key={item.label} value={item.label}>
                            {item.label}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardHeader subheader="Account Details" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Registration Number"
                    name="reg"
                    onChange={handleChange}
                    required
                    value={partnerData.reg}
                    variant="outlined"
                    disabled
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="GST"
                    name="gst"
                    onChange={handleChange}
                    required
                    value={partnerData.gst}
                    variant="outlined"
                  />
                </Grid>

                <Grid item md={4} xs={12}>
                  <MobileDatePicker
                    required
                    fullWidth
                    label="Contract Start"
                    inputFormat="MM/dd/yyyy"
                    variant="outlined"
                    name="contractStart"
                    value={partnerData.contractStart}
                    onChange={handleStartDate}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>

                <Grid item md={4} xs={12}>
                  <MobileDatePicker
                    required
                    fullWidth
                    label="Contract End"
                    inputFormat="MM/dd/yyyy"
                    variant="outlined"
                    name="contractEnd"
                    value={partnerData.contractEnd}
                    onChange={handleEndDate}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Fleet Type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Fleet Type"
                      name="type"
                      onChange={handleChange}
                      value={partnerData.type}
                    >
                      <MenuItem value={"2W"}>2W</MenuItem>
                      <MenuItem value={"3W"}>3W</MenuItem>
                      <MenuItem value={"LMV"}>LMV</MenuItem>
                      <MenuItem value={"HMV"}>HMV</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardHeader subheader="Contact Details" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type='email'
                    onChange={handleChange}
                    required
                    value={partnerData.email}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    onChange={handleChange}
                    required
                    value={partnerData.phone}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Address Line 1"
                    name="line1"
                    onChange={handleChange}
                    required
                    value={partnerData.line1}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Address Line 2"
                    name="line2"
                    onChange={handleChange}
                    required
                    value={partnerData.line2}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    onChange={handleChange}
                    required
                    value={partnerData.city}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    label="State"
                    name="state"
                    onChange={handleChange}
                    required
                    value={partnerData.state}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={4} xs={12}>
                  <TextField
                    fullWidth
                    label="Zip"
                    name="zip"
                    onChange={handleChange}
                    required
                    value={partnerData.zip}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Divider />
          <Button
            color="primary"
            variant="contained"
            sx={{ marginTop: 3, float: "right" }}
            onClick={onFormSubmit}
            disabled={!checkIfAllFieldsAvailable()}
          >
            UPDATE
          </Button>
        </Box>
      </Modal>
      <Card>
        <CardContent
          sx={{ float: 'right', display: 'flex', flexDirection: 'row' }}
        >
          <span style={{ padding: '4px' }}> Page : </span>
          <Pagination
            count={get(data, 'Corporates.pagination.totalPages', 1)}
            showFirstButton={get(
              data,
              'Corporates.pagination.hasPrevPage',
              false
            )}
            showLastButton={get(
              data,
              'Corporates.pagination.hasNextPage',
              false
            )}
            onChange={(e, page) => {
              handlePagination(page);
            }}
          />
        </CardContent>
      </Card>
      <QueryTable
        open={openDetail}
        getUserName={selectedPartner.name}
        handleClose={handleClose}
        queryObject={selectedPartner}
        getQueryValue={getKeyValue}
      />


    </React.Fragment>
  );
};

export default Listings;
