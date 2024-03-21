import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  CardHeader,
} from "@mui/material";
import Bookings from "../../../components/bookings";
import { DashboardLayout } from "../../../components/dashboard-layout";
import Filters, {
  CPO,
  Stations,
  Status,
  SelectCPO,
} from "../../../components/operators/Operator/utils/Filters";
import { get } from "lodash";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import stationsQuery from "../../../graphQL/stations/getStations";
import allBookings from "../../../graphQL/bookings/allBookings";
import { useLazyQuery } from "@apollo/client";
import Booking from 'src/components/operators/Operator/bookings';
import compose from '../../../utils/compose';
import { auth } from '../../../utils/ssrUtils';

const BookingListCPO = (props) => {
  const router = useRouter();
  const { id: name } = router.query;
  const [station, setStation] = useState("");
  const [stations, setStations] = useState([]);
  const [date, setDate] = useState("");
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = useState(0);
  const [cpo, setCPO] = useState("");
  const [status, setStatus] = useState("");
  const [counts, setCounts] = useState({
    total: 0,
    hold: 0,
    cancelled: 0,
    reserved: 0,
    running: 0,
    completed: 0,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };
  const [loadStations, { data: stationsList }] = useLazyQuery(stationsQuery, {
    variables: {
      pagination: {
        page: 1,
        limit: 1000,
      },
      filter: {
        cpoId: name
      },
    },
  });

  const [loadBookingsCount, { data: bookingCounts }] = useLazyQuery(
    allBookings,
    {
      variables: {
        pagination: {
          page: 1,
          limit: 1000,
        },
        all: {
          cpoId: get(cpo, "id", ""),
          stationId: get(station, "id", ""),
          status: ["RESERVED", "HOLD", "CANCELED", "COMPLETED", "RUNNING"],
        },
        reserved: {
          cpoId: get(cpo, "id", ""),
          stationId: get(station, "id", ""),
          status: ["RESERVED"],
        },
        hold: {
          cpoId: get(cpo, "id", ""),
          stationId: get(station, "id", ""),
          status: ["HOLD"],
        },
        cancelled: {
          cpoId: get(cpo, "id", ""),
          stationId: get(station, "id", ""),
          status: ["CANCELED"],
        },
        completed: {
          cpoId: get(cpo, "id", ""),
          stationId: get(station, "id", ""),
          status: ["COMPLETED"],
        },
        running: {
          cpoId: get(cpo, "id", ""),
          stationId: get(station, "id", ""),
          status: ["RUNNING"],
        },
      },
    }
  );

  useEffect(() => {
    if (name) {
      loadStations();
      loadBookingsCount();
    }
  }, [cpo, station]);

  useEffect(() => {
    loadBookingsCount();
  }, []);

  useEffect(() => {
    const running = get(bookingCounts, "running.pagination.totalDocs", 0);
    const reserved = get(bookingCounts, "reserved.pagination.totalDocs", 0);
    const cancelled = get(bookingCounts, "cancelled.pagination.totalDocs", 0);
    const hold = get(bookingCounts, "hold.pagination.totalDocs", 0);
    const completed = get(bookingCounts, "completed.pagination.totalDocs", 0);
    const total = running + reserved + cancelled + hold + completed;
    setCounts({
      running,
      reserved,
      cancelled,
      hold,
      completed,
      total,
    });
  }, [bookingCounts]);

  useEffect(() => {
    if (stationsList) {
      const list = get(stationsList, "Stations.docs", []);
      let mappedData = list.map((item) => {
        return { label: item.name || "", name: item.name || "", ...item };
      });
      mappedData = mappedData.filter((item) => item.name);
      setStations(mappedData);
    }
  }, [stationsList]);

  const defaultStatus = [
    "RESERVED",
    "HOLD",
    "CANCELED",
    "COMPLETED",
    "RUNNING",
  ];

  const statusFilter = status ? [status] : defaultStatus;
  return (
    <Booking></Booking>
  );
};

BookingListCPO.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default BookingListCPO;
export const getServerSideProps = compose(auth);
