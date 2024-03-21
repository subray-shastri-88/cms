import React, { useEffect, useState } from "react";
import { get } from "lodash";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TablePagination,
  Card,
  Button,
  CardContent,
  Chip,
  IconButton,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import PerfectScrollbar from "react-perfect-scrollbar";
import bookings from "./__mocks__/bookings";
import getBookings from "../../graphQL/bookings";
import { useQuery } from "@apollo/client";
import Ring from "../ui/Loader/Ring";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import QueryTable, { TableBuilder } from "../queryTable";
import { round } from 'lodash'
import * as XLSX from 'xlsx';
import moment from "moment/moment";

const Bookings = ({
  status,
  userId,
  createdBefore,
  createdAfter,
  startAfter,
  cpoId,
  stationId,
}) => {
  const [reservations, setReservations] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openQueryTable, setOpenQueryTable] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState({});
  const [userName, setUserName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const getBookingDate = (item) => {
    const timestamp = get(item, "startTime", null);
    if (!timestamp) {
      return "--";
    }
    const date = new Date(timestamp * 1);
    return (
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    );
  };


  const formattedTime = (date) => { 
    return moment(parseFloat(date)).format('DD MMM YYYY, h:mm:ss a') 
  }

  const formattedDate = (date) => {
    return moment(parseFloat(date)).format('DD MMM YYYY') 
  }


  const getBDate = (item) => {
    if (!item) {
      return "--";
    }
    const date = new Date(item * 1);
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

  const handleOpen = (item) => {
    setSelectedBooking(item);
    setOpenQueryTable(true);
  };

  const handleClose = () => {
    setSelectedBooking({});
    setOpenQueryTable(false);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "HOLD":
        return <Chip color="warning" size="small" label="Hold" />;
      case "COMPLETED":
        return <Chip color="success" size="small" label="Completed" />;
      case "RESERVED":
        return <Chip color="primary" size="small" label="Reserved" />;
      case "RUNNING":
        return <Chip color="info" size="small" label="Running" />;
      case "CANCELED":
        return <Chip color="error" size="small" label="Canceled" />;
      default:
        return <Chip size="small" label="--" />;
    }
  };

  const getSettlementChip = (status) => {
    switch (status) {
      case "UNSETTLED":
        return (
          <Chip
            sx={{ width: "85px" }}
            color="warning"
            size="small"
            label="Ready"
          />
        );
      case "SETTLED":
        return (
          <Chip
            sx={{ width: "85px" }}
            color="success"
            size="small"
            label="Settled"
          />
        );
      case "NOT_READY":
        return (
          <Chip
            color="error"
            sx={{ width: "85px" }}
            size="small"
            label="Not Ready"
          />
        );
      default:
        return <Chip sx={{ width: "85px" }} size="small" label="--" />;
    }
  };

  const getUKeyValue = (mainKey, key) => {
    const item = selectedBooking[mainKey][key] || "--";
    switch (key) {
      case "power":
        return item + ' kW'
      default:
        return item;
    }
  };

  const getKeyValue = (key) => {
    const item = selectedBooking[key];
    switch (key) {
      case "cpo": {
        const { __typename, ...rest } = item;
        return (
          <TableBuilder
            item={rest}
            getQueryValue={(val) => getUKeyValue("cpo", val)}
          />
        );
      }
      case "station": {
        const { __typename, ...rest } = item;
        return (
          <TableBuilder
            item={rest}
            getQueryValue={(val) => getUKeyValue("station", val)}
          />
        );
      }
      case "user": {
        const { __typename, ...rest } = item;
        return (
          <TableBuilder
            item={rest}
            getQueryValue={(val) => getUKeyValue("user", val)}
          />
        );
      }
      case "charger": {
        const { ...rest } = item;
        return (
          <TableBuilder
            item={rest}
            getQueryValue={(val) => getUKeyValue("charger", val)}
          />
        );
      }
      case "plug": {
        const { ...rest } = item;
        return (
          <TableBuilder
            item={rest}
            getQueryValue={(val) => getUKeyValue("plug", val)}
          />
        );
      }
      case "status": {
        return getStatusChip(item);
      }
      case "settlement": {
        return getSettlementChip(item);
      }
      case "acceptStartChargingAt":
      case "startTime":
      case "endTime":
      case "createdAt":
      case "holdExpiry":
      case "chargingStartTime":
      case "chargingEndTime":
        return getBDate(item);
      case "amount":
      case "refundAmount":
      case "reservedAmount":
      case "totalPowerCharge":
      case "totalServiceCharge":
      case "totalGST":
      case "quickPlugFees":
        return '₹ ' + round(item, 2) || 0;
      case "pricePerUnit":
        return '₹ ' + round(item, 2) + ' (Excl. GST)' || 0;
      case "powerRating":
      case "unitsConsumed":
      case "power":
        return round(item, 2) + ' kW' || 0 + ' kW';
      case "initialsoc":
      case "finalsoc":
        return (item || '--') + ' (in %)';
      case "slotDuration":
      case "duration":
        return Math.floor(item) + ' mins' || '--'
      default:
        return item || "--";
    }
  };

  const { loading, error, data, refetch } = useQuery(getBookings, {
    variables: {
      filter: {
        userId: userId,
        status: [...status],
        createdBefore: createdBefore,
        createdAfter: createdAfter,
        startAfter: startAfter,
        cpoId: cpoId,
        stationId: stationId,
      },
      pagination: {
        page: 0,
        limit: rowsPerPage,
      },
    },
  });

  const handlePagination = (page) => {
    refetch({
      filter: {
        userId: userId,
        status: [...status],
        createdBefore: createdBefore,
        createdAfter: createdAfter,
        startAfter: startAfter,
        cpoId: cpoId,
        stationId: stationId,
      },
      pagination: {
        page: page,
        limit: rowsPerPage,
      },
    });
  };

  useEffect(() => {
    const lists = get(data, "Reservations.docs", []);
    setReservations(lists);
  }, [loading, error, data, status]);

  const duration = (timestamp1, timestamp2) => {
    if (!timestamp1 || !timestamp2) {
      return "--";
    }
    var difference = timestamp2 - timestamp1;
    var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    var hoursDifference = Math.floor(difference / 1000 / 60);
    hoursDifference = Math.abs(hoursDifference);
    return `${hoursDifference} mins`;
  };

  const excelData = reservations.map((e) => {
    return { 
      "Booking Id": e.id ,
      "Booking Date": formattedDate(e.startTime),
      "Station":e.station.name,
      "CPO":e.cpo.name,
      "User Id":e.user.id,
      "Name":e.user.name,
      "Email":e.user.email,
      "Contact": e.user.phone,
      "Charger Id":e.charger.id,
      "Charger Type":e.chargeType,
      "Plug No": e.plug.name,
      "Power":e.plug.power,
      "Start Time": e.startTime ? formattedTime(e.startTime) :'' , 
      "End TIme": e.endTime ? formattedTime(e.endTime) : '',
      "Slot Duration":e.slotDuration,
      "Price/Unit (₹)":e.pricePerUnit,
      "Charge Start Time":e.chargingStartTime ? formattedTime(e.chargingStartTime):'' ,
      "Charge End Time":e.chargingEndTime ? formattedTime(e.chargingEndTime) :'',
      "Charge Duration":e.duration,
      "Units Consumed (kW)":e.unitsConsumed,
      "Meter Start":e.meterAtStart,
      "Meter End":e.meterAtEnd,
      "Intial SOC":e.initialsoc,
      "Final SOC":e.finalsoc ,
      "Total Power Charges (₹)":e.totalPowerCharge,
      "Total Service Charges (₹)":e.totalServiceCharge,
      "Total GST (₹)":e.totalGST,
      "Total Amount (₹)": e.amount,
      "Reserved Amount (₹)":e.reservedAmount,
      "Refund Amount (₹)":e.refundAmount,
      "Booking Type":e.type,
      "Booking Status": e.status
    }
  });

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workbook, `Bookings_${formattedTime(new Date())}.csv`);
  };


  return (
    <React.Fragment>
      {/* {loading && <Ring />} */}
      <Box
        sx={{
          overflowX: "auto",
          "@media (max-width: 600px)": {
            padding: "1rem",
          },
          "@media (min-width: 601px) and (max-width: 1024px)": {
            padding: "2rem",
          },
        }}
      >

        <Button onClick={() => downloadExcel(excelData)} sx={{float:'right'}}>Download Excel</Button>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Station</TableCell>
              <TableCell>CPO</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Settlement</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Units Consumed (kW)</TableCell>
              <TableCell>
                {status[0] === "COMPLETED" ? "Amount" : "Amount"}
              </TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{get(item, "user.name", "--")}</TableCell>
                  <TableCell>{get(item, "station.name", "--")}</TableCell>
                  <TableCell>{get(item, "cpo.name", "--")}</TableCell>
                  <TableCell>
                    {
                      getStatusChip(get(item, "status", "--"))}
                  </TableCell>
                  <TableCell>{getBookingDate(item)}</TableCell>
                  <TableCell>
                    {getSettlementChip(get(item, "settlement", ""))}
                  </TableCell>
                  <TableCell>
                    {item.status === 'COMPLETED' ? get(item, 'duration') + ' mins' : get(item, 'duration')}
                  </TableCell>
                  <TableCell>
                    {get(item, "status") === "COMPLETED"
                      ? round(get(item, "unitsConsumed", "--"), 2)
                      : '0'}
                  </TableCell>
                  <TableCell>
                    ₹
                    {get(item, "status") === "COMPLETED"
                      ? get(item, "amount", "--")
                      : '0'}
                  </TableCell>

                  <TableCell>
                    <IconButton onClick={() => handleOpen(item)}>
                      <InfoIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      {reservations.length <= 0 && (
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "150px",
              width: "100%",
            }}
          >
            No reservations found
          </div>
        </Card>
      )}
      <Card sx={{ display: "flex", justifyContent: "flex-end" }}>
        <CardContent>
          <span style={{ padding: "4px" }}> Page : </span>
          <Pagination
            count={get(data, "Reservations.pagination.totalPages", 1)}
            showFirstButton={get(
              data,
              "Reservations.pagination.hasPrevPage",
              false
            )}
            showLastButton={get(
              data,
              "Reservations.pagination.hasNextPage",
              false
            )}
            onChange={(e, page) => {
              handlePagination(page);
            }}
          />
        </CardContent>
      </Card>

      <QueryTable
        open={openQueryTable}
        handleClose={handleClose}
        queryObject={selectedBooking}
        getUserName={selectedBooking?.user?.name}
        getQueryValue={getKeyValue}
      />
    </React.Fragment>
  );
};

export default Bookings;
