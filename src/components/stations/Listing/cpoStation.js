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
    TableContainer,
    TableRow,
    TextField,
    Typography,
    useTheme,
    Autocomplete,
    Badge,
    Paper,
    Collapse,
    ButtonGroup,
    StyledTableCell,
    ToggleButton,
    FormControlLabel,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import { get } from "lodash";
  import LoadingButton from "@mui/lab/LoadingButton";
  import NewStation from "../AddNew";
  import PerfectScrollbar from "react-perfect-scrollbar";
  import EvStationIcon from "@mui/icons-material/EvStation";
  import SearchIcon from "@mui/icons-material/Search";
  import stationsQuery from "../../../graphQL/stations/getStations";
  import { useLazyQuery, useQuery } from "@apollo/client";
  import { WithCpoCtx } from "../../../contexts/cpoContext";
  import Pagination from "@mui/material/Pagination";
  import NewMachine from "./addMachine";
  import AddLocationIcon from "@mui/icons-material/AddLocation";
  import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
  import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
  import { fetcher } from "../../../utils/httpService";
  import InfoIcon from "@mui/icons-material/Info";
  import GenerateQRCodePDF from "../../QRCode";
  import QrCode2Icon from "@mui/icons-material/QrCode2";
  import { useMutation } from "@apollo/client";
  import userApis from "../../../graphQL/users";
  import ModeEditIcon from "@mui/icons-material/ModeEdit";
  import stationRequest from "../../../graphQL/stations";
  import { emptyValueChecker } from "../../../utils/jsUtils";
  import ErrorBox from "../../ui/ErrorBox/ErrorBox";
  import Swal from "sweetalert2";
  import { updatePlug } from "src/graphQL/machines/plugs";
  import { TotalStations, ActiveStations, InactiveStations } from '../../dashboard/tasks-progress';
  import { ConfirmationModal } from './confirmationModal';
  import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
  import { OCPP } from "src/utils/config";
  import { useRouter } from "next/router";
  
  const StatusPill = ({ status, chargers }) => {
    const plugs = [];
  
    chargers.map((item) => {
      item.plugs.map((plug) => {
        const pg = get(plug, "supportedPort", "");
        if (pg) {
          plugs.push({
            ...plug,
            type: pg,
            power: item.power,
          });
        }
      });
    });
  
    let rez = {};
    plugs.forEach((item) => {
      rez[`${item.type}`] ? rez[`${item.type}`]++ : (rez[`${item.type}`] = 1);
    });
  
    return Object.keys(rez).map((item) => (
      <Badge
        key={item.id}
        badgeContent={rez[`${item}`]}
        size="small"
        color="success"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Chip key={item.id} label={`${item}`} size="small" variant="filled" />
      </Badge>
    ));
  };
  
  const getStatusChip = (status) => {
    switch (status) {
      case "ACTIVE":
        return <Chip color="success" size="small" label="Active" />;
      case "IN_ACTIVE":
        return <Chip color="error" size="small" label="Deactivated" />;
    }
  };
  
  const getAvailabilityChip = (status) => {
    switch (status) {
      case "Available":
        return <Chip color="success" size="small" label="Available" />;
      case "Offline":
        return <Chip color="default" size="medium" label="Offline" />;
      case "Reserved":
        return <Chip color="warning" size="small" label="Reserved" />;
      case "Charging":
        return <Chip color="warning" size="small" label="Charging" />;
      case "Preparing":
        return <Chip color="info" size="small" label="Preparing" />;
      case "Finishing":
        return <Chip color="info" size="small" label="Finishing" />;
      case "NotFound":
        return <Chip color="error" size="small" label="Not Connected" />;
      default:
        return <Chip size="small" label={status} />;
    }
  };
  
  const QRCOdeModal = ({ visible, setVisible, chargerId, plugId }) => {
    return (
      <Modal open={visible} onClose={() => setVisible(false)}>
        <GenerateQRCodePDF data={`${chargerId}/${plugId}`} />
      </Modal>
    );
  };
  
  const PlugRow = ({ historyRow, row, stationId, refetch }) => {
    const [availability, setAvailability] = useState();
    const [qrModal, setQrModal] = useState(false);
    const [plug, setPlug] = useState(historyRow.status);
  
    const plugStatus = async () => {
      const res = await fetcher(
        `${OCPP.OCPP_HOST}/status-get/${row.id}/${historyRow.name}`
      );
      const data = {
        text: res?.status || res?.message || "",
        success: res && res.status ? true : false,
      };
      console.log(res.data)
      if(res && res.data){
        setAvailability(res.data);
      }
    };
  
    console.log(availability,'availability')
  
    const [handleTogglePlugStatus, { data: toggleData }] = useMutation(
      updatePlug,
      {
        variables: {
          input: null,
          stationId: null,
          chargerId: null,
          plugId: null
        },
      }
    );
  
    const toggleUser = (stationId, chargerId, plugId, status, name, power) => {
      const fields = {
        stationId: stationId,
        chargerId: chargerId,
        plugId: plugId,
        input: {
          name: name,
          power: power,
          status: status === "ACTIVE" ? "IN_ACTIVE" : "ACTIVE",
        },
  
      };
      handleTogglePlugStatus({
        variables: fields,
      });
    };
  
    useEffect(() => {
      plugStatus();
    }, []);
  
    useEffect(() => {
      if (toggleData) {
        refetch;
        setPlug(plug === 'ACTIVE' ? 'IN_ACTIVE' : 'ACTIVE')
      }
    }, [toggleData])
  
    return (
      <>
        <TableRow>
          <TableCell sx={{ paddingY: "10px" }} component="th" scope="row">
            {historyRow.name}
          </TableCell>
          <TableCell>{historyRow.power}</TableCell>
          <TableCell align="right">{historyRow.supportedPort}</TableCell>
          <TableCell align="right">
            {"₹ "}
            {historyRow.defaultTariffUnitPrice}
          </TableCell>
          <TableCell align="right">{getStatusChip(plug)}</TableCell>
          <TableCell align="right">
            {availability &&
              getAvailabilityChip(
                availability.status ? availability.status : "NotFound"
              )}
          </TableCell>
          <TableCell align="right">
            <IconButton
              size="large"
              aria-label="download"
              color="primary"
              onClick={() => setQrModal(true)}
            >
              <QrCode2Icon />
            </IconButton>
          </TableCell>
          <TableCell>
            <ButtonGroup
              size="small"
              aria-label="small button group"
              variant="text"
            >
              {!(plug === "ACTIVE") ? (
                <Button
                  key="one"
                  color="success"
                  sx={{ width: "92px" }}
                  onClick={() => toggleUser(stationId, row.id, historyRow.id, historyRow.status, historyRow.name, historyRow.power)}
                >
                  Activate
                </Button>
              ) : (
                <Button
                  key="one"
                  color="error"
                  sx={{ width: "92px" }}
                  onClick={() => toggleUser(stationId, row.id, historyRow.id, historyRow.status, historyRow.name, historyRow.power)}
                >
                  Deactivate
                </Button>
              )}
            </ButtonGroup>
          </TableCell>
        </TableRow>
        <QRCOdeModal
          visible={qrModal}
          setVisible={setQrModal}
          chargerId={row.id}
          plugId={historyRow.name}
        />
      </>
    );
  };
  
  const CollapseItem = ({ open, row, stationId, refetch }) => {
    return (
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ margin: 1 }}>
          <Table aria-label="purchases" size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ paddingY: "10px" }}>Plug No.</TableCell>
                <TableCell>Power (kw)</TableCell>
                <TableCell align="right">Port</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right"> Status</TableCell>
                <TableCell align="right"> Availability</TableCell>
                <TableCell align="right"> QR Code</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {row.plugs.map((historyRow) => (
                <PlugRow
                  key={historyRow.name}
                  historyRow={historyRow}
                  row={row}
                  stationId={stationId}
                  refetch={refetch}
                />
              ))}
            </TableBody>
          </Table>
        </Box>
      </Collapse>
    );
  };
  
  const Row = ({ row, stationId, refetch }) => {
    const [open, setOpen] = React.useState(false);
    const [charger, setCharger] = useState(row.status);
    const [openModal, setOpenModal] = React.useState(false);
    const [chargerRow, setChargerRow] = useState();
  
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
    const { updateCharger } = stationRequest;
  
    const [handleTogglePlugStatus, { data: toggleData }] = useMutation(
      updateCharger,
      {
        variables: {
          input: null,
          stationId: null,
          chargerId: null,
        },
      }
    );
  
    const toggleUser = (stationId, chargerId, type, status, name, power) => {
      const fields = {
        stationId: stationId,
        chargerId: chargerId,
        input: {
          name: name,
          power: power,
          type: type,
          status: status === "ACTIVE" ? "IN_ACTIVE" : "ACTIVE",
        },
  
      };
      handleTogglePlugStatus({
        variables: fields,
      });
    };
  
    const deleteCharger = (stationId, chargerId, type, status, name, power) => {
      const fields = {
        stationId: stationId,
        chargerId: chargerId,
        input: {
          name: name,
          power: power,
          type: type,
          status: status === "ACTIVE" ? "IN_ACTIVE" : "ACTIVE",
          deleted: true
        },
  
      };
      handleTogglePlugStatus({
        variables: fields,
      });
    };
  
    const ConfirmationForDelete = (stationId, chargerId, type, status, name, power) => {
      handleClickOpen();
    }
  
    const handleCloseSubmit = (stationId, chargerId, type, status, name, power) => {
      deleteCharger(stationId, chargerId, type, status, name, power)
    };
  
    useEffect(() => {
      if (toggleData) {
        refetch;
        setCharger(charger === 'ACTIVE' ? 'IN_ACTIVE' : 'ACTIVE')
      }
    }, [toggleData])
  
    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.id}
          </TableCell>
          <TableCell align="right">{row.name}</TableCell>
          <TableCell align="right">{row.plugs.length}</TableCell>
          <TableCell align="right">{row.power}</TableCell>
          <TableCell align="right"><Chip
            label={
              charger === "ACTIVE"
                ? "Active"
                : "Deactivated"
            }
            size="small"
            variant="filled"
            color={
              charger === "ACTIVE" ? "success" : "error"
            }
          /></TableCell>
          <TableCell align="right">{row.templateId}</TableCell>
          <TableCell align="right">{row.type}</TableCell>
          <TableCell align="right">
            {row.ocppVersion === "V_1_6" ? "1.6" : "--"}
          </TableCell>
          <TableCell>
            <ButtonGroup
              size="small"
              aria-label="small button group"
              variant="text"
            >
              {!(charger === "ACTIVE") ? (
                <Button
                  key="one"
                  color="success"
                  sx={{ width: "92px" }}
                  onClick={() => toggleUser(stationId, row.id, row.type, row.status, row.name, row.power)}
                >
                  Activate
                </Button>
              ) : (
                <Button
                  key="one"
                  color="error"
                  sx={{ width: "92px" }}
                  onClick={() => toggleUser(stationId, row.id, row.type, row.status, row.name, row.power)}
                >
                  Deactivate
                </Button>
              )}
            </ButtonGroup>
          </TableCell>
          {/* <TableCell>
            <DeleteForeverIcon
              color="error"
              onClick={() => { ConfirmationForDelete(); setChargerRow(row) }}
            ></DeleteForeverIcon>
          </TableCell> */}
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            {open && <CollapseItem open={open} row={row} stationId={stationId} refetch={refetch} />}
          </TableCell>
        </TableRow>
        {/* <ConfirmationModal 
         open={open}
         handleClose={handleClose}
         title={"Are you sure want to delete?"}
        /> */}
      </React.Fragment>
    );
  };
  
  const ListResults = ({
    data,
    loading,
    refetch,
    allPartners,
    refetchStationData,
    stationData,
    handlePagination,
    ...rest
  }) => {
    const [stations, setStations] = useState([]);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [detailsModal, setDetailsModal] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [selectedStationId, setStationID] = useState();
    const [selectedStationCPOId, setStationCPOID] = useState();
    const [selectedStation, setSelectedStation] = useState();
    const { getUsers, ToggleUserStatus } = userApis;
    const [list, setList] = useState([]);
    const [value, setValue] = useState({
      stationName: "",
    });
  
    const handleOpenOnEditClick = (id, cpoId) => {
      setStationID(id);
      setStationCPOID(cpoId);
      setOpen(true);
    };
  
    const AmenitiesList = [
      "Restaurant",
      "Wifi",
      "Cafe",
      "Park",
      "RestRooms",
      "Baby Care",
      "Shopping",
    ];
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
    const [chargers, setChargers] = useState([]);
    const [error, setError] = useState(false);
    const [cpoList, setCpoList] = useState(allPartners);
    const [isFieldsEmpty, setIsFieldsEmpty] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [st , setSt] = useState({});
  
    const defaultValues = {
      stationName: st.name,
      line1: "",
      line2: "",
      city: "",
      state: "",
      zip: "",
      stationDescription: "",
      cpo: "",
      longitude: "",
      latitude: "",
      maplink: "",
      slotTimeInMin: "",
      conatctPerson: "",
      contactNumber: ""
    };
  
    const [values, setValues] = useState(defaultValues);
  
    const { createStation, createCharger, updateStation } = stationRequest;
  
    const timeSlots = [
      { label: "15 Minutes", value: "15" },
      { label: "30 Minutes", value: "30" },
      { label: "1 Hour", value: "60" },
      { label: "2 Hours", value: "120" },
      { label: "5 Hours", value: "300" },
      { label: "Max", value: "540" },
    ];
  
    const [valueData, setValueData] = useState({
      stationName: "",
      stationId: "",
      stationDescription: "",
      line1: "",
      line2: "",
      longitude: "",
      latitude: "",
      city: "",
      state: "",
      zip: "",
      timeSlots: "",
    });
  
    useEffect(() => {
      if (openModal && st) {
        setValueData({
          stationId: st.id,
          stationName: st.name,
          cpoName : st.cpo.name,
          stationType: st.stationType,
          stationDescription: st.description,
          line1: st.address.line1,
          line2: st.address.line2,
          longitude: Number(st.position.coordinates[0]),
          latitude: Number(st.position.coordinates[1]),
          city: st.address.city,
          state: st.address.state,
          zip: st.address.zip,
          location: st.location,
          slotTimeInMin: st.slotTimeInMin,
        });
      }
    }, [openModal, st]);
  
    const handleChange = (event) => {
      setValueData({
        ...valueData,
        [event.target.name]: event.target.value,
      });
    };
  
    const handleTimeSlotChange = (value) => {
      setValueData({
        ...valueData,
        slotTimeInMin: value,
      });
    };
  
    const handleStationTypeChange = (value) => {
      setValueData({
        ...valueData,
        stationType: value,
      });
    };
  
    console.log(st , 'st')
  
    const [updateStationField, { error: err , data: updateData}] = useMutation(updateStation, {
      variables: {
        stationId: valueData.stationId,
        input: {
          name: valueData.stationName,
          description: valueData.stationDescription,
          stationType: valueData.stationType,
          address: {
            line1: valueData.line1,
            line2: valueData.line2,
            city: valueData.city,
            state: valueData.state,
            zip: valueData.zip,
            // phone: valueData.phone,
          },
          position: {
            latitude: Number(valueData.latitude),
            longitude: Number(valueData.longitude),
          },
        },
      },
    });
  
    console.log(updateData , 'updatedata')
  
    const handleAmenities = (event) => {
      const {
        target: { value },
      } = event;
      setValueData({
        ...values,
        amenities: typeof value === "string" ? value.split(",") : value,
      });
    };
  
    const handleCpoChange = (value) => {
      setValues({
        ...values,
        cpo: value,
      });
    };
  
  
    const handleSubmit = (event) => {
      event.preventDefault();
      updateStationField({
        variables: {
          stationId: valueData.stationId,
          input: {
            name: valueData.stationName,
            description: valueData.stationDescription,
            stationType: get(valueData, "stationType.value", valueData.stationType),
            address: {
              line1: valueData.line1,
              line2: valueData.line2,
              city: valueData.city,
              state: valueData.state,
              zip: valueData.zip,
              // phone: valueData.phone,
            },
            position: {
              latitude: Number(valueData.latitude),
              longitude: Number(valueData.longitude),
            },
            slotTimeInMin: get(valueData, "slotTimeInMin.value", valueData.slotTimeInMin),
          },
        },
      });
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: " Station successfully updated",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    };
  
    useEffect(() => {
      const checkIfEmpty = emptyValueChecker(valueData);
      setIsFieldsEmpty(checkIfEmpty);
    }, [valueData]);
  
    useEffect(() => {
      setCpoList(allPartners);
    }, [allPartners]);
  
    const style = {
      bgcolor: "#eee",
      border: "2px solid transparent",
      boxShadow: 24,
      p: 4,
    };
  
    const randomStatus = (index) => {
      if (index === 0) {
        return "active";
      }
      if (index === 1) {
        return "";
      }
      if (index % 2 === 0) {
        return "active";
      }
      if (index % 3 === 0) {
        return "busy";
      }
      if (index % 5 === 0) {
        return "down";
      }
      return "active";
    };
  
    useEffect(() => {
      if (data && data.Stations) {
        setStations(data.Stations.docs);
      }
    }, [data]);
  
    useEffect(() => {
      if (!open) {
        setStationID();
      }
    }, [open]);
  
    const handleStationIdClick = (index) => {
      setDetailsModal(true);
      const station = stations[index];
      if (station) {
        setSelectedStation(station);
      }
    };
  
    const [handleToggleStationStatus, { data: toggleData }] = useMutation(
      updateStation,
      {
        variables: {
          input: null,
          stationId: null,
        },
      }
    );
  
    const toggleUser = (stationId, latitude, longitude, status) => {
      const fields = {
        stationId: stationId,
        input: {
          position: {
            latitude: latitude,
            longitude: longitude,
          },
          status: status === "ACTIVE" ? "IN_ACTIVE" : "ACTIVE",
        },
  
      };
      handleToggleStationStatus({
        variables: fields,
      });
    };
  
    const stationTypes = [
      { label: "PUBLIC", value: "PUBLIC" },
      { label: "PRIVATE", value: "PRIVATE" },
      { label: "CAPTIVE", value: "CAPTIVE" }
    ];
    const [editStation, setEditStation] = useState(null);
  
    const handleEditStation = (station) => {
      setEditStation(station);
    };
  
    const handleCloseEditModal = () => {
      setOpenModal(false);
    };
  
    useEffect(() => {
      if (toggleData && data && data.Stations) {
        setStations(data.Stations.docs);
        refetch();
      }
    }, [toggleData, data]);
  
    useEffect(()=>{
      if(updateData){
        handleCloseEditModal();
        refetch();
      }
    }, [updateData])
  
    const handleOpenEditModal = () => {
      setOpenModal(true);
    };
  
    console.log(st , 'data');
    console.log(valueData.cpoName)
  
    return (
      <Card {...rest}>
        {/* {loading && <Ring />} */}
        <PerfectScrollbar>
          <Box sx={{ minWidth: 1050 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Station Name</TableCell>
                  <TableCell>CPO</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Plugs</TableCell>
                  <TableCell>Add Machine</TableCell>
                  <TableCell>More</TableCell>
                  <TableCell>Actions</TableCell>
                  <TableCell>Edit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stations.map(
                  ({ id, name, address, cpo, chargers, status, position , stationType ,description , location , slotTimeInMin }, index, item) => (
                    <TableRow hover key={id}>
                      <TableCell>
                        <Typography color="textPrimary" variant="body1">
                          {id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          <Typography color="textPrimary" variant="body1">
                            {name}
                          </Typography>
                        </Box>
                      </TableCell>
                      {/* <TableCell>{cpo.name}</TableCell> */}
                      <TableCell>{cpo ? cpo.name : "No CPO"}</TableCell>
  
                      <TableCell>{`${address.city}`}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            status === "ACTIVE"
                              ? "Active"
                              : "Deactivated"
                          }
                          size="small"
                          variant="filled"
                          color={
                            status === "ACTIVE" ? "success" : "error"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <StatusPill
                          status={randomStatus(index)}
                          chargers={chargers}
                        />
                      </TableCell>
  
                      <TableCell>
                        <IconButton
                          onClick={() => handleOpenOnEditClick(id, cpo.id)}
                          aria-label="Edit machine"
                          size="large"
                        >
                          <EvStationIcon
                            fontSize="inherit"
                            aria-label="Edit Machine"
                            color="success"
                          />
                        </IconButton>
                      </TableCell>
                      <TableCell
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IconButton
                          onClick={() => handleStationIdClick(index)}
                          aria-label="Add New Machine"
                          size="large"
                        >
                          <InfoIcon
                            fontSize="inherit"
                            aria-label="Add New Machine"
                          />
                        </IconButton>
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
                              onClick={() => toggleUser(id, position.coordinates[1], position.coordinates[0], status)}
                            >
                              Activate
                            </Button>
                          ) : (
                            <Button
                              key="one"
                              color="error"
                              sx={{ width: "92px" }}
                              onClick={() => toggleUser(id, position.coordinates[1], position.coordinates[0], status)}
                            >
                              Deactivate
                            </Button>
                          )}
                        </ButtonGroup>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {handleOpenEditModal(stationData); 
                            setSt({
                              id: id,
                              name: name,
                              cpo: cpo,
                              address: address,
                              position: position,
                              stationType: stationType,
                              description: description,
                              location: location,
                              slotTimeInMin: slotTimeInMin
                            })}}
                          aria-label="Edit"
                          size="small"
                        >
                          <ModeEditIcon fontSize="inherit" aria-label="Edit" />
                        </IconButton>
                        <Modal
                          open={openModal}
                          onClose={handleCloseEditModal}
                          aria-labelledby="parent-modal-title"
                          aria-describedby="parent-modal-description"
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: "80%",
                              maxHeight: "80vh",
                              overflowY: "auto",
                              background: "#fff",
                              padding: "34px 24px",
                              borderRadius: "20px",
                            }}
                          >
                            <form autoComplete="off" noValidate>
                              {/* {loading && <Ring />} */}
                              <Grid container spacing={1}>
                                <Grid item md={12} xs={10}>
                                  <Card>
                                    <CardHeader
                                      subheader="Add the business name of Charging Center"
                                      title="Station Details"
                                    />
                                    <Divider />
                                    <CardContent>
                                      <Grid container spacing={3}>
                                        {(error || err) && (
                                          <ErrorBox message="Something Went Wrong" />
                                        )}
                                        <Grid item md={4} xs={10}>
                                          <TextField
                                            fullWidth
                                            label="Name"
                                            name="stationName"
                                            onChange={handleChange}
                                            required
                                            value={valueData.stationName}
                                            variant="filled"
                                            disabled={false}
                                          />
                                        </Grid>
                                        <Grid item md={4} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Selected Partner"
                                            name="partner"
                                            onChange={handleChange}
                                            required
                                            value={valueData.cpoName}
                                            variant="filled"
                                            disabled={true}
                                          />
                                        </Grid>
                                        <Grid item md={4} xs={12}>
                                          <Autocomplete
                                            fullWidth
                                            disablePortal
                                            id="combo-box-demo"
                                            options={stationTypes}
                                            onChange={(event, newValue) =>
                                              handleStationTypeChange(newValue)
                                            }
                                            value={valueData.stationType}
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                label="Select Station type"
                                                variant="filled"
                                              />
                                            )}
                                            disabled={get(data, "createStation.data.id")}
                                            variant="filled"
                                          />
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                          <TextField
                                            fullWidth
                                            label="Description"
                                            name="stationDescription"
                                            onChange={handleChange}
                                            value={valueData.stationDescription}
                                            variant="filled"
                                            disabled={false}
                                          />
                                        </Grid>
                                      </Grid>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              </Grid>
                              <Grid
                                container
                                spacing={3}
                                sx={{
                                  marginTop: "10px",
                                  position: "relative",
                                }}
                              >
                                <Grid item md={8} xs={12}>
                                  <Card>
                                    <CardHeader
                                      subheader="Add the address of Charging Center"
                                      title="Location Details"
                                    />
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
                                            value={valueData.line1}
                                            variant="filled"
                                            disabled={false}
                                          />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                          <TextField
                                            fullWidth
                                            label="Address Line 2"
                                            name="line2"
                                            onChange={handleChange}
                                            required
                                            value={valueData.line2}
                                            variant="filled"
                                            disabled={false}
                                          />
                                        </Grid>
                                        <Grid item md={4} xs={12}>
                                          <TextField
                                            fullWidth
                                            label="City"
                                            name="city"
                                            onChange={handleChange}
                                            required
                                            value={valueData.city}
                                            variant="filled"
                                            disabled={false}
                                          />
                                        </Grid>
                                        <Grid item md={4} xs={12}>
                                          <TextField
                                            fullWidth
                                            label="State"
                                            name="state"
                                            onChange={handleChange}
                                            required
                                            value={valueData.state}
                                            variant="filled"
                                            disabled={false}
                                          />
                                        </Grid>
                                        <Grid item md={4} xs={12}>
                                          <TextField
                                            fullWidth
                                            label="Zip"
                                            name="zip"
                                            onChange={handleChange}
                                            required
                                            value={valueData.zip}
                                            variant="filled"
                                            disabled={false}
                                          />
                                        </Grid>
                                      </Grid>
                                    </CardContent>
                                    <Divider />
                                  </Card>
                                </Grid>
                                <Grid item md={4} xs={12}>
                                  <Card>
                                    <CardHeader
                                      subheader="Add the address of Charging Center"
                                      title="Coordinates"
                                    />
                                    <Divider />
                                    <CardContent>
                                      <Grid container spacing={3}>
                                        <Grid item md={6} xs={12}>
                                          <TextField
                                            fullWidth
                                            label="Latitude"
                                            name="latitude"
                                            onChange={handleChange}
                                            required
                                            value={valueData.latitude}
                                            variant="filled"
                                          // disabled={false}
                                          />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                          <TextField
                                            fullWidth
                                            label="Longitude"
                                            name="longitude"
                                            onChange={handleChange}
                                            required
                                            value={valueData.longitude}
                                            variant="filled"
                                          // disabled={false}
                                          />
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                          <TextField
                                            fullWidth
                                            label="Google Map Link"
                                            name="maplink"
                                            onChange={handleChange}
                                            required
                                            value={valueData.location}
                                            variant="filled"
                                          // disabled={false}
                                          />
                                        </Grid>
                                      </Grid>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              </Grid>
                              <Grid
                                container
                                spacing={3}
                                sx={{
                                  marginTop: "10px",
                                  position: "relative",
                                }}
                              >
                                <Grid item md={5} xs={12}>
                                  <Card>
                                    <CardHeader
                                      subheader="Choose the timings of your favourites to charge your vehicle"
                                      title="Select the time slot"
                                    />
                                    <Divider />
                                    <CardContent>
                                      <div>
                                        <Grid>
                                          <Autocomplete
                                            fullWidth
                                            disablePortal
                                            id="combo-box-demo"
                                            options={timeSlots}
                                            onChange={(event, newValue) =>
                                              handleTimeSlotChange(newValue)
                                            }
                                            value={valueData.slotTimeInMin}
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                label="Select Time Slot"
                                                variant="filled"
                                              />
                                            )}
                                            disabled={false}
                                            variant="filled"
                                          />
                                        </Grid>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </Grid>
                                {/* <Grid item md={7} xs={12}>
                                  <Card>
                                    <CardHeader
                                      subheader="Add station contact person details "
                                      title="Contact Details"
                                    />
                                    <Divider />
                                    <CardContent>
                                      <Grid container spacing={3}>
                                        <Grid item md={6} xs={12}>
                                          <TextField
                                            fullWidth
                                            label="Name"
                                            name="conatctPerson"
                                            onChange={handleChange}
                                            required
                                            value={values.conatctPerson}
                                            variant="filled"
  
                                          />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                          <TextField
                                            fullWidth
                                            label="Number"
                                            name="contactNumber"
                                            onChange={handleChange}
                                            required
                                            value={values.contactNumber}
                                            variant="filled"
  
                                          />
                                        </Grid>
                                      </Grid> 
                                    </CardContent>
                                  </Card>
                                </Grid>*/}
                              </Grid>
  
                              <Card>
                                <CardContent>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      p: 6,
                                    }}
                                  >
                                    <Button
                                      color="success"
                                      variant="contained"
                                      onClick={handleSubmit}
                                      disabled={
                                        get(data, "createStation.data.id") ||
                                        isFieldsEmpty
                                      }
                                    >
                                      Update Station
                                    </Button>
                                  </Box>
                                </CardContent>
                              </Card>
                            </form>
                          </Box>
                        </Modal>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Box>
  
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{
              position: "fixed",
              top: "5%",
              left: "0",
              right: "0",
              width: "85vw",
              margin: "auto",
              overflowY: "scroll",
              height: "900px",
            }}
          >
            <NewMachine
              stationId={selectedStationId}
              cpoId={selectedStationCPOId}
              setOpen={handleClose}
              fetchData={handlePagination}
              page={page}
            />
          </Modal>
          <Modal
            open={detailsModal}
            onClose={() => setDetailsModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{
              position: "fixed",
              top: "5%",
              left: "0",
              right: "0",
              width: "80vw",
              margin: "auto",
              overflowY: "scroll",
              height: "900px",
            }}
          >
            <Card>
              <CardHeader
                title={selectedStation && selectedStation.name}
                subheader={"Station Details"}
                sx={{ paddingBottom: "0px" }}
              ></CardHeader>
              {selectedStation && (
                <CardContent>
                  <Grid container spacing={3} sx={{ marginBottom: "20px" }}>
                    <Grid item md={4} xs={12}>
                      <Card>
                        <CardHeader
                          title="Details :"
                          sx={{ margin: "0px", paddingY: "5px" }}
                        />
                        <CardContent sx={{ paddingY: "0px" }}>
                          <p>
                            <span>
                              <b>CPO</b> : <span>{selectedStation.cpo.name}</span>
                            </span>
                          </p>
                          <p>
                            <span>
                              <b>Phone</b> :{" "}
                              <span>{selectedStation.address.phone}</span>
                            </span>
                          </p>
                          <p>
                            <span>
                              <b>Description</b> :{" "}
                              <span>{selectedStation.description}</span>
                            </span>
                          </p>
                          <p>
                            <span>
                              <b>Station Type</b> :{" "}
                              <span>{selectedStation.stationType}</span>
                            </span>
                          </p>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <Card>
                        <CardHeader
                          title="Address :"
                          sx={{ margin: "0px", paddingY: "5px" }}
                        />
                        <CardContent sx={{ paddingY: "0px" }}>
                          <p>
                            {selectedStation.address.line1}
                            {selectedStation.address.line2}
                            {selectedStation.address.city}
                            {selectedStation.address.state}-
                            {selectedStation.address.zip}
                          </p>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item md={4} xs={12}>
                      <Card>
                        <CardHeader
                          title="Location :"
                          sx={{ margin: "0px", paddingY: "5px" }}
                        />
                        <CardContent sx={{ paddingY: "0px" }}>
                          <p>
                            <span>
                              <b>Map</b> :{" "}
                              <a
                                rel="noreferrer"
                                href={selectedStation.location}
                                target="_blank"
                              >
                                {selectedStation.location}
                              </a>
                            </span>
                          </p>
                          <p
                            style={{
                              marginTop: "5px",
                            }}
                          >
                            <span
                              style={{
                                marginRight: "15px",
                              }}
                            >
                              <b>Lat</b> :{" "}
                              {selectedStation.position.coordinates[1]}
                            </span>
                            <span>
                              <b>Lng</b> :{" "}
                              {selectedStation.position.coordinates[0]}
  
                            </span>
                          </p>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
  
                  <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          <TableCell>Id</TableCell>
                          <TableCell align="right">Name</TableCell>
                          <TableCell align="right">Plugs</TableCell>
                          <TableCell align="right">Power (kw)</TableCell>
                          <TableCell align="right">Status</TableCell>
                          <TableCell align="right">Template Id</TableCell>
                          <TableCell align="right">Type</TableCell>
                          <TableCell align="right">Ocpp</TableCell>
                          <TableCell>Actions</TableCell>
                          {/* <TableCell>Remove</TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedStation.chargers.map((row) => (
                          <Row key={row.name} row={row} stationId={selectedStation.id} refetch={refetch()} />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              )}
            </Card>
          </Modal>
        </PerfectScrollbar>
        <Card>
          <CardContent
            sx={{ float: "right", display: "flex", flexDirection: "row" }}
          >
            <span style={{ padding: "4px" }}> Page : </span>
            <Pagination
              count={get(data, "Stations.pagination.totalPages", 1)}
              showFirstButton={get(
                data,
                "Stations.pagination.hasPrevPage",
                false
              )}
              page={get(data, "Stations.pagination.page", 1)}
              showLastButton={get(data, "Stations.pagination.hasNextPage", false)}
              onChange={(e, page) => {
                setPage(page);
                handlePagination(page);
              }}
            />
          </CardContent>
        </Card>
      </Card>
    );
  };
  
  const Listings = ({ allPartners }) => {
    const router = useRouter();
    const {id} = router.query;
    const [btnLoading, setBtnLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [filters, setFilters] = useState({
      cpoId: id,
      stationId: "",
      query: "",
    });
  
    const { loading, error, data, refetch } = useQuery(stationsQuery, {
      variables: {
        pagination: {
          page: 1,
          limit: 10,
        },
        filter: {
          query: "",
          stationId: "",
          cpoId: id,
        },
      },
    });
  
    const [activeStations, { data: activeStationsCount }] = useLazyQuery(stationsQuery, {
      variables: {
        pagination: {
          page: 1,
          limit: 10,
        },
        filter: {
          status: "ACTIVE",
          query: filters.query,
          stationId: filters.stationId,
          cpoId: id,
        }
      }
    })
  
    const [inActiveStations, { data: inActiveStationsCount }] = useLazyQuery(stationsQuery, {
      variables: {
        pagination: {
          page: 1,
          limit: 10,
        },
        filter: {
          status: "IN_ACTIVE",
          query: filters.query,
          stationId: filters.stationId,
          cpoId: id,
        }
      }
    })
  
    useEffect(() => {
      activeStations();
      inActiveStations();
    }, []);
  
    let total_stations = get(data, 'Stations.pagination.totalDocs', 0);
  
    let active = get(activeStationsCount, 'Stations.pagination.totalDocs', 0);
    let inActive = get(inActiveStationsCount, 'Stations.pagination.totalDocs', 0)
  
    const handleFilterInputChange = (event) => {
      setFilters({
        ...filters,
        [event.target.name]: event.target.value,
      });
    };
  
    const handleCpoChange = (value) => {
      const id = get(value, "id", "");
      setFilters({ ...filters, cpoId: id });
      refetch({
        pagination: {
          page: 1,
          limit: 10,
        },
        filter: {
          query: filters.query,
          stationId: filters.stationId,
          cpoId: id,
        },
      });
    };
  
    const onSubmit = () => {
      refetch({
        pagination: {
          page: 1,
          limit: 10,
        },
        filter: {
          query: filters.query,
          stationId: filters.stationId,
          cpoId: filters.cpoId,
        },
      });
    };
  
    const handlePagination = (page) => {
      refetch({
        filter: {
          query: filters.query,
          stationId: filters.stationId,
          cpoId: filters.cpoId,
        },
        pagination: {
          page: page,
          limit: 10,
        },
      });
    };
  
    return (
      <Grid container>
        <Grid container spacing={4} sx={{ paddingBottom: "32px" }}>
          <Grid item xl={4} mds={4} sm={6} xs={12}>
            <TotalStations station={total_stations} />
          </Grid>
          <Grid item xl={4} mds={4} sm={6} xs={12}>
            <ActiveStations activeStation={active} />
          </Grid>
          <Grid item xl={4} mds={4} sm={6} xs={12}>
            <InactiveStations inactiveStation={inActive} />
          </Grid>
        </Grid>
        <Grid item md={12} xs={12}>
          <Card >
            <CardHeader
              subheader="List of all charging stations published on quikplugs"
              title="Stations"
              sx={{ paddingBottom: 0 }}
            />
            <CardContent>
              <Box
                sx={{
                  height: "auto",
                  position: "relative",
                }}
              >
  
                <Grid container spacing={3} sx={{ marginBottom: "32px" }}>
                  <Grid item md={3} xs={12}>
                    <TextField
                      fullWidth
                      label="Station ID"
                      name="stationId"
                      onChange={handleFilterInputChange}
                      required
                      variant="filled"
                    />
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextField
                      fullWidth
                      label="Station Name"
                      name="query"
                      onChange={handleFilterInputChange}
                      required
                      variant="filled"
                    />
                  </Grid>
                  {/* <Grid item md={3} xs={12}>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      id="combo-box-demo"
                      options={allPartners}
                      onChange={(event, newValue) => handleCpoChange(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Partner"
                          variant="filled"
                        />
                      )}
                      variant="filled"
                    />
                  </Grid> */}
                  <Grid
                    item
                    md={3}
                    xs={12}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "15px",
                    }}
                  >
                    <LoadingButton
                      onClick={onSubmit}
                      endIcon={<SearchIcon />}
                      loadingPosition="end"
                      variant="contained"
                      size="small"
                    >
                      Search
                    </LoadingButton>
                    {/* <Button
                      onClick={() => setOpen(true)}
                      endIcon={<AddLocationIcon />}
                      // loadingPosition="end"
                      variant="contained"
                      size="small"
                    >
                      Add Station
                    </Button> */}
                  </Grid>
                </Grid>
  
                <ListResults
                  // loading={loading}
                  error={error}
                  data={data}
                  refetch={refetch}
                  handlePagination={handlePagination}
                />
                <Modal
                  open={open}
                  onClose={() => setOpen(false)}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  sx={{
                    position: "fixed",
                    top: "5%",
                    left: "0",
                    right: "0",
                    width: "85vw",
                    margin: "auto",
                    overflowY: "scroll",
                    height: "900px",
                  }}
                >
                  <NewStation
                    handleModalClose={() => setOpen(false)}
                    refetchStationData={handlePagination}
                  />
                </Modal>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };
  
  export default WithCpoCtx(Listings);
  