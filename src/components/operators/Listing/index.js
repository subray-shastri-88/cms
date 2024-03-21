import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  useTheme,
  Button,
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
  Switch,
  IconButton,
  Modal,
  ButtonGroup,
  ToggleButton,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import { get } from "lodash";
import { styled } from "@mui/material/styles";
import { WithCpoCtx } from "../../../contexts/cpoContext";
import QueryTable from "../../queryTable";
import InfoIcon from "@mui/icons-material/Info";
import PerfectScrollbar from "react-perfect-scrollbar";
import { operators, powerTypes, revenue, totalRevenue } from "./__mocks__/data";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import Pagination from "@mui/material/Pagination";
import userApis from "../../../graphQL/users";
import { useQuery, useMutation } from "@apollo/client";
import Ring from "../../ui/Loader/Ring";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import NewOperatorModal from "./__mocks__/NewOperatorModal";
import ErrorBox from "../../ui/ErrorBox/ErrorBox";
import { emptyValueChecker } from "../../../utils/jsUtils";
import cpoRequests from "../../../graphQL/cpo/index";
import Swal from "sweetalert2";
import { StateList , CityList } from "src/utils/common";
import { State, City } from 'country-state-city';
import { CountryCode } from "src/utils/config";

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
  overflow: "scroll",
  height: "100%",
  display: "block",
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    fontSize: "8px !important",
    padding: "5px !important",
  },
  [theme.breakpoints.down("mds")]: {
    fontSize: "10px !important",
    padding: "5px !important",
  },
}));

const Listings = ({
  cpos,
  loadCpoList,
  loadIsoList,
  isoPaginationData,
  paginationData,
  iso,
  loadISO,
  type,
  kind,
  isAdmins,
  reloader,
  resourceId = "",
  defaultType,
  header,
}) => {
  const [list, setList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [pager, setPager] = useState({});
  const { getUsers, ToggleUserStatus } = userApis;
  const [selectedPartner, setSelectedPartner] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = React.useState(false);
  const [isActive, setIsActive] = useState(true);
  const [openDetails, setOpenDetails] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState({});
  const [selectedEditOperator, setSelectedEditOperator] = useState(null);
  const [row, setRow] = useState({})
  const { updateCPO } = cpoRequests;

  const theme = useTheme();
  const defaultData = {
    name: "",
    type: row.kind,
    city: city?.name,
    line1: "",
    line2: "",
    state: state?.name,
    zip: "",
    phone: "",
    gst: "",
    pan: "",
    accountNumber: "",
    ifsc: "",
    kind: ''
  };
  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false,
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: "index",
      titleFontColor: theme.palette.text.primary,
    },
  };
  const { error, refetch } = useQuery(getUsers, {
    variables: {
      filter: {
        kind: kind,
        resourceId: resourceId,
      },
      pagination: {
        page: 0,
        limit: rowsPerPage,
      },
    },
  });

  const [handleToggleUserStatus, { data: toggleData }] = useMutation(
    updateCPO,
    {
      variables: {
        input: null,
        cpoId: null,
      },
    }
  );

  const handleOpenDetails = (item) => {
    setSelectedOperator(item);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedOperator({});
    setOpenDetails(false);
  };

  const handleCloseEdit = () => {
    setEditOperator(null);
    setOpenEdit(false);
  };

  useEffect(() => {
    if (type === "ISO") {
      loadISO();
    }
  }, []);

  const handleOpen = (item) => {
    setSelectedPartner(item);
    setOpen(true);
  };
  const handleClose = () => {
    setSelectedPartner(defaultData);
    setOpen(false);
  };

  const handleOpenEdit = (item) => {
    setSelectedEditOperator(item);
    setPartnerData({
      name: item.name,
      type: item.type,
      city: item.address.city,
      line1: item.address.line1,
      line2: item.address.line2,
      state: item.address.state,
      zip: item.address.zip,
      phone: item.address.phone,
      pan: item.billing?.pan || "",
      gst: item.billing?.gst || "",
      accountNumber: item.billing?.accountNumber || "",
      ifsc: item.billing?.ifsc || "",
    });
    setIsActive(item.status === "active");
    setOpenEdit(true);
  };
  const getKeyValue = (key) => {
    const item = selectedPartner[key];
    switch (key) {
      case "contractStartDate":
        return getBookingDate(item);
      case "contractEndDate":
        return getBookingDate(item);
      case "address":
        return `${get(item, "address.line1", "")} ${get(
          item,
          "address.line2",
          ""
        )} ${get(item, "address.city", "")} ${get(
          item,
          "address.state",
          ""
        )}-${get(item, "address.zip", "")}`;
      case "billing":
        return `${get(item, "billing.gst")}`
      default:
        return item;
    }
  };

  const handledPagination = (page) => {
    refetch({
      filter: {
        kind: kind,
      },
      pagination: {
        page: page,
        limit: rowsPerPage,
      },
    });
  };

  useEffect(() => {
    setList(type === "ISO" ? iso : cpos);
    setPager(type === "ISO" ? isoPaginationData : paginationData);
  }, [cpos, iso]);

  const handlePagination = (page) => {
    type === "ISO" ? loadIsoList(page) : loadCpoList(page);
  };
  useEffect(() => {
    reloader &&
      reloader({
        fetch: () => handledPagination(0),
      });
  }, []);

  useEffect(() => {
    let lists = get(data, "Users.docs", []).filter((item) => item.id);
    setUserList(lists);
  }, []);

  const toggleUser = (cpoId, kind, status) => {
    const fields = {
      cpoId: cpoId,
      input: {
        kind: kind,
        status: status === "ACTIVE" ? "IN_ACTIVE" : "ACTIVE",
      },

    };
    handleToggleUserStatus({
      variables: fields,
    });
  };

  useEffect(() => {
    if (toggleData) {
      defaultType === "ISO" ? loadIsoList() : loadCpoList();
    }
  }, [toggleData]);

  const [editOperator, setEditOperator] = useState(null);

  // const handleEditOperator = (operator) => {
  //   setEditOperator(operator);
  // };

  const handleEditOperator = (operator) => {
    // Set the editOperator state with the selected operator's data
    setEditOperator(operator);
    setOpen(true); // Open the modal
  };

  const [updateNewCPO, { data, loading, error: mutationError }] =
    useMutation(updateCPO);

  const [partnerData, setPartnerData] = useState(defaultData);
  const [hasError, setHasError] = useState(false);

  const handleChange = (event) => {
    setPartnerData({
      ...partnerData,
      [event.target.name]: event.target.value,
    });
  };

  const onFormSubmit = async () => {
    console.log(row.id, 'row id')
    setHasError(false);
    if (partnerData.type === undefined || partnerData.type === '') {
      partnerData.type = row.kind
    }
    const checkIdEmpty = emptyValueChecker(row.id);
    const checkKindEmpty = emptyValueChecker(row.kind);
    const checkIfEmpty = emptyValueChecker(partnerData);
    if (checkIfEmpty) {
      setHasError(true);
      console.log(partnerData)
    } else {
      try {
        await updateNewCPO({
          variables: {
            cpoId: row.id,
            input: {
              address: {
                line1: partnerData.line1,
                line2: partnerData.line2,
                city: partnerData.city,
                state: partnerData.state,
                zip: partnerData.zip,
                phone: partnerData.phone,
              },
              billing: {
                gst: partnerData.gst,
                pan: partnerData.pan,
                accountNumber: partnerData.accountNumber,
                ifsc: partnerData.ifsc,
              },
              kind: row.kind,
              name: partnerData.name,
              phone: partnerData.phone,
            },
          },
        });
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "operator successfully updated",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error creating new operator:", error);
      }
    }
  };

  console.log(partnerData , 'data')
  useEffect(()=>{
    setState({
      name: partnerData.state,
      isoCode: '',
      label: partnerData.state
    })
  })

  const [allStateList, setAllStateList] = useState();
  const [previousState, setPreviousState] = useState(
    {
    name: partnerData?.state,
    isoCode: '',
    label: partnerData?.state
  }
  );
  const [state, setState] = useEffect()
  const [allCityList, setAllCityList] = useState();
  const [city, setCity] = useState();
  const [previousCity, setPreviousCity] = useState(
    {
    name: partnerData?.state,
    isoCode: '',
    label: partnerData?.state
  }
  );

  console.log(state , 'stateee')

  useEffect(() => {
    if (data || mutationError) {
      handleCloseEdit();
      setPartnerData(defaultData);
      defaultType === "ISO" ? loadIsoList() : loadCpoList();
    }
  }, [data, mutationError]);

  useEffect(() => {
    console.log(previousState , 'p-state')
    let allStatesFromCountry = State.getStatesOfCountry(CountryCode.IN);
    let allStates = allStatesFromCountry.map((item) => {
      return { name: item.name || '', isoCode: item.isoCode || '', label: item.name || '' }
    })
    allStates = allStates.filter((item) => item.name)
    setAllStateList(allStates)

    console.log(state , 'state')

    if(previousState && state === undefined){
       setState(previousState)
    }

    if (state && state !== undefined) {
      setPreviousState(state)
      let stateId = get(state, 'isoCode', '')
      let allCitiesFromState = City.getCitiesOfState(CountryCode.IN, stateId);
      let allCities = allCitiesFromState.map((item) => {
        return { name: item.name || '', stateCode: item.stateCode || '', label: item.name || '' }
      })
      allCities = allCities.filter((item) => item.name)
      setAllCityList(allCities)
    }
  }, [state])

  return (
    <React.Fragment>
      {/* {loading && <Ring />} */}
      <Grid container spacing={3}>
        <Grid item md={12} xs={12} sx={{ padding: "0px" }}>
          <Grid spacing={3}>
            <Grid item md={12} xs={12}>
              <Card>
                <Box>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Operator ID</StyledTableCell>
                        <StyledTableCell>Operator Name</StyledTableCell>
                        <StyledTableCell>City</StyledTableCell>
                        <StyledTableCell>Contact No.</StyledTableCell>
                        <StyledTableCell>Details</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                        <StyledTableCell>Actions</StyledTableCell>
                        <StyledTableCell>Edit</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {list.map((item) => {
                        return (
                          <TableRow key={item.id}>
                            <StyledTableCell>{item.id}</StyledTableCell>
                            <StyledTableCell>{item.name}</StyledTableCell>
                            <StyledTableCell>
                              {item.address.city}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.address.phone}
                            </StyledTableCell>
                            <StyledTableCell>
                              <IconButton
                                onClick={() => handleOpen(item)}
                                aria-label="delete"
                                size="large"
                              >
                                <InfoIcon fontSize="inherit" />
                              </IconButton>
                            </StyledTableCell>
                            <TableCell>
                              <Chip
                                label={
                                  item.status === "ACTIVE"
                                    ? "Active"
                                    : "Deactivated"
                                }
                                size="small"
                                variant="filled"
                                color={
                                  item.status === "ACTIVE" ? "success" : "error"
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <ButtonGroup
                                size="small"
                                aria-label="small button group"
                                variant="text"
                              >
                                {!(get(item, "status") === "ACTIVE") ? (
                                  <Button
                                    key="one"
                                    color="success"
                                    sx={{ width: "92px" }}
                                    onClick={() => toggleUser(item.id, item.kind, item.status)}
                                  >
                                    Activate
                                  </Button>
                                ) : (
                                  <Button
                                    key="one"
                                    color="error"
                                    sx={{ width: "92px" }}
                                    onClick={() => toggleUser(item.id, item.kind, item.status)}
                                  >
                                    Deactivate
                                  </Button>
                                )}
                              </ButtonGroup>
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => { setRow(item); handleOpenEdit(item) }}
                                aria-label="Edit"
                                size="small"
                              >
                                <ModeEditIcon
                                  fontSize="inherit"
                                  aria-label="Edit"
                                />
                              </IconButton>
                              <Modal
                                open={openEdit}
                                onClose={handleCloseEdit}
                                aria-labelledby="edit-modal-title"
                                aria-describedby="edit-modal-description"
                              >
                                <Box
                                  sx={{
                                    ...style,
                                  }}
                                >
                                  {mutationError && (
                                    <ErrorBox message="Something Went Wrong" />
                                  )}
                                  {/* {loading && <Ring />} */}
                                  {hasError && (
                                    <ErrorBox message="Please Enter all fields" />
                                  )}
                                  <Card>
                                    <CardHeader
                                      subheader=""
                                      title="Edit the details"
                                    />
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
                                          />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                          <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">
                                              Partner Type
                                            </InputLabel>
                                            <Select
                                              labelId="demo-simple-select-label"
                                              id="demo-simple-select"
                                              label="Partner Type"
                                              name="type"
                                              onChange={handleChange}
                                              required
                                              value={row.kind}
                                              disabled={row.kind}
                                            >
                                              <MenuItem value={"CPO"}>
                                                CPO
                                              </MenuItem>
                                              <MenuItem value={"ISO"}>
                                                ISO
                                              </MenuItem>
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
                                        <Grid item md={6} xs={12}>
                                          {/* <TextField
                                            fullWidth
                                            label="City"
                                            name="city"
                                            onChange={handleChange}
                                            required
                                            value={partnerData.city}
                                            variant="outlined"
                                          /> */}
                                          <StateList state={state} handleStateChange={setState} allStates={allStateList} />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
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
                                        <Grid item md={6} xs={12}>
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
                                            label="PAN"
                                            name="pan"
                                            onChange={handleChange}
                                            required
                                            value={partnerData.pan}
                                            variant="outlined"
                                          />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                          <TextField
                                            fullWidth
                                            label="GST No."
                                            name="gst"
                                            onChange={handleChange}
                                            required
                                            value={partnerData.gst}
                                            variant="outlined"
                                          />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                          <TextField
                                            fullWidth
                                            label="Account Number"
                                            name="accountNumber"
                                            onChange={handleChange}
                                            required
                                            value={partnerData.accountNumber}
                                            variant="outlined"
                                          />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                          <TextField
                                            fullWidth
                                            label="IFSC"
                                            name="ifsc"
                                            onChange={handleChange}
                                            required
                                            value={partnerData.ifsc}
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
                                  >
                                    UPDATE
                                  </Button>
                                </Box>
                              </Modal>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  <Card>
                    <CardContent
                      sx={{
                        float: "right",
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <span style={{ padding: "4px" }}> Page : </span>
                      <Pagination
                        count={get(pager, "totalPages", 1)}
                        page={get(pager, "page", 1)}
                        showFirstButton={get(pager, "hasPrevPage", false)}
                        showLastButton={get(pager, "hasNextPage", false)}
                        onChange={(e, page) => {
                          handlePagination(page);
                        }}
                      />
                    </CardContent>
                  </Card>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Grid>       
      </Grid>
      <QueryTable
        open={open}
        handleClose={handleClose}
        queryObject={selectedPartner}
        getQueryValue={getKeyValue}
        getUserName={selectedPartner?.name}
      />
    </React.Fragment>
  );
};

export default WithCpoCtx(Listings);
