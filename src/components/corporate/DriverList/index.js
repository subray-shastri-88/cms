import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { get } from "lodash";
import {
  Box,
  Container,
  Modal,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CardHeader,
  Chip,
  Button,
  TextField,
  ButtonGroup,
  Pagination,
  IconButton,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { updateDriver } from "../../../graphQL/corporate";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useMutation } from "@apollo/client";
import UpdateDriverModal from "./updateDriverModal";
import UpdateWallet from "./updateWallet";
import AssignVehicle from "./assignVehicle";
import UpdateMasterWallet from "./updateMasterWallet";
import { assignVehicle } from "../../../graphQL/corporate";
// import { CorporateStatusEnum } from "../../utils/config";

const HighLight = ({
  label,
  value,
  valueStyle = {},
  labelStyle = {},
  textSecondaryLabel,
  actionItem,
}) => {
  return (
    <Card elevation={11}>
      <CardHeader
        sx={{
          paddingX: {
            xs: "10px !important",
            sm: "10px !important",
            md: "10px !important",
            lg: "15px !important",
          },
          paddingTop: {
            xs: "10px !important",
            sm: "10px !important",
            md: "10px !important",
            lg: "15px !important",
          },
          paddingBottom: "0px !important",
        }}
        title={label}
        action={actionItem && actionItem}
      />
      <CardContent
        sx={{
          paddingY: "10px !important",
          padding: {
            xs: "10px !important",
            sm: "10px !important",
            md: "10px !important",
            lg: "15px !important",
          },
        }}
        md={{ padding: "10px !important" }}
      >
        <Typography color="textPrimary" variant="h4" sx={valueStyle}>
          {value}
        </Typography>
        {textSecondaryLabel && (
          <Typography color="textSecondary" variant="caption">
            {textSecondaryLabel}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export { UpdateDriverModal, UpdateWallet, HighLight };

const DriverList = ({
  drivers,
  pagination,
  onPagination,
  corporate,
  driverBaseUrl,
}) => {
  const [open, setOpen] = useState(false);
  const [walletModal, setWalletModal] = useState(false);
  const [masterWalletModal, setMasterWalletModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState();
  const [aVModal, setAVModal] = useState(false);

  const handlePagination = (page) => {
    onPagination(page);
  };
  const handleEdit = (driver) => {
    setOpen(true);
    setSelectedDriver(driver);
  };

  const handleEditMasterWallet = () => {
    setMasterWalletModal(true);
  };

  const handleEditWallet = (driver) => {
    setWalletModal(true);
    setSelectedDriver(driver);
  };

  const handleAssignVehicle = (driver) => {
    setAVModal(true);
    setSelectedDriver(driver);
  };

  const [updateDriverData, { data, loading, error: err }] = useMutation(
    updateDriver,
    {
      variables: {
        driverId: "",
        input: {
          status: null,
        },
      },
    }
  );

  const handleUpdateDriver = ({ id, status }) => {
    let fields = {};
    if (status) {
      const newStatus = status === "ACTIVE" ? "IN_ACTIVE" : "ACTIVE";
      fields.status = newStatus;
    }
    updateDriverData({
      variables: {
        driverId: id,
        input: fields,
      },
    });
  };

  useEffect(() => {
    if (data) {
      onPagination();
      setOpen(false);
      setSelectedDriver();
    }
  }, [data]);

  const [deAssignVehicleModel, { data: deAssignData }] = useMutation(
    assignVehicle,
    {
      variables: {
        driverId: null,
        vehicleId: null,
      },
    }
  );

  const handleDelete = (driverId) => {
    deAssignVehicleModel({
      variables: {
        driverId: driverId,
        vehicleId: "",
      },
    });
  };

  useEffect(() => {
    if (deAssignData) {
      handlePagination(1);
    }
  }, [deAssignData]);

  return (
    <Grid container spacing={3} sx={{ paddingX: "15px" }}>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <HighLight
          label={"Name"}
          value={corporate.name}
          textSecondaryLabel={`Partner ID : ${corporate.id}`}
        />
      </Grid>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <HighLight
          label={"Master Wallet"}
          value={`₹ ${get(corporate, "wallet.credit", "0")}`}
          textSecondaryLabel={" Total Wallet Balance"}
          actionItem={
            <IconButton onClick={handleEditMasterWallet} size="small">
              <AccountBalanceWalletIcon fontSize="inherit" />
            </IconButton>
          }
        />
      </Grid>
      <Grid item xl={6} lg={3} sm={6} xs={12}>
        <HighLight
          label={"Total"}
          value={pagination?.totalDocs || 0}
          textSecondaryLabel={"Drivers"}
        />
      </Grid>
      <Grid item xl={6} lg={3} sm={6} xs={12}>
        <HighLight
          label={"Active"}
          value={pagination?.totalDocs || 0}
          textSecondaryLabel={"Drivers"}
        />
      </Grid>
      <Grid item lg={12} md={12} xl={9} xs={12}>
        <Card>
          <PerfectScrollbar>
            <Box>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Mobile</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Vehicle</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Wallet</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {drivers.map(({ id, status, user, vehicle = {} }) => {
                    return (
                      <TableRow key={id}>
                        <TableCell>
                          <a href={`${driverBaseUrl}/driver/${id}`}>{id}</a>
                        </TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {get(vehicle, "id") ? (
                            <Chip
                              label={get(vehicle, "registrationNumber", "")}
                              onDelete={() => handleDelete(id)}
                              deleteIcon={<DeleteIcon />}
                            />
                          ) : (
                            <Chip
                              color="primary"
                              label="Add Vehicle"
                              onDelete={() => handleAssignVehicle({ id })}
                              deleteIcon={<AddCircleIcon />}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {get(vehicle, "model.name", "- NA -")}
                        </TableCell>
                        <TableCell>
                          ₹ {get(user, "wallet.credit", "0")}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${
                              status === "ACTIVE" ? "active" : "deactivated"
                            } `}
                            color={`${
                              status === "ACTIVE" ? "success" : "default"
                            }`}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <ButtonGroup
                            size="small"
                            aria-label="small button group"
                            variant="text"
                          >
                            {!(status === "ACTIVE") ? (
                              <Button
                                key="one"
                                color="success"
                                sx={{ width: "92px" }}
                                onClick={() =>
                                  handleUpdateDriver({
                                    id,
                                    status,
                                  })
                                }
                              >
                                Activate
                              </Button>
                            ) : (
                              <Button
                                key="one"
                                color="error"
                                sx={{ width: "92px" }}
                                onClick={() =>
                                  handleUpdateDriver({
                                    id,
                                    status,
                                  })
                                }
                              >
                                Deactivate
                              </Button>
                            )}
                            <Button
                              onClick={() => handleEdit({ id, status })}
                              key="two"
                              color="warning"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleEditWallet({ id })}
                              key="two"
                            >
                              Wallet
                            </Button>
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
            <Card>
              <CardContent
                sx={{ float: "right", display: "flex", flexDirection: "row" }}
              >
                <span style={{ padding: "4px" }}> Page : </span>
                <Pagination
                  count={get(pagination, "totalPages", 1)}
                  showFirstButton={get(pagination, "hasPrevPage", false)}
                  showLastButton={get(pagination, "hasNextPage", false)}
                  onChange={(e, page) => {
                    handlePagination(page);
                  }}
                />
              </CardContent>
            </Card>
          </PerfectScrollbar>
        </Card>
      </Grid>
      <UpdateDriverModal
        open={open}
        setOpen={setOpen}
        driver={selectedDriver}
        callBack={onPagination}
      />
      <UpdateWallet
        open={walletModal}
        setOpen={setWalletModal}
        corpId={corporate?.id}
        driverId={selectedDriver?.id}
        callBack={handlePagination}
      />
      <AssignVehicle
        open={aVModal}
        setOpen={setAVModal}
        corpId={corporate?.id}
        driverId={selectedDriver?.id}
        callBack={handlePagination}
      />
      <UpdateMasterWallet
        open={masterWalletModal}
        setOpen={setMasterWalletModal}
        corpId={corporate?.id}
      />
    </Grid>
  );
};

export default DriverList;
