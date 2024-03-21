import React, { useEffect, useState } from "react";
import { get } from "lodash";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Modal,
  Divider,
  Grid,
  Button
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Support, updateService } from "src/graphQL/support/service";
import { useMutation, useQuery } from "@apollo/client";
import Pagination from "@mui/material/Pagination";
import QueryTable, { TableBuilder } from "../queryTable";
import moment from "moment/moment";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Status } from '../operators/Operator/utils/Filters';
import Swal from "sweetalert2";
import ErrorBox from "../ui/ErrorBox/ErrorBox";

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

const Services = ({
  status,
  type
}) => {
  const [reservations, setReservations] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openQueryTable, setOpenQueryTable] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState({});
  const [userName, setUserName] = useState("");
  const [openModal, setOpenModal] = useState(false)
  const [row, setRow] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editType , setEditType] = useState('');

  const handleOpen = (item) => {
    setSelectedRequest(item);
    setOpenQueryTable(true);
  };

  const handleClose = () => {
    setSelectedRequest({});
    setOpenQueryTable(false);
  };

  const defaultStatus = [
    'PENDING',
    'OPENED',
    'ASSIGNED',
    'INPROCESS',
    'CLOSED'
  ];

  const requestType = [
    'Wallet',
    'Charging',
    'Profile',
    'Stations'
 ];

  const format = (date) => {
    let t = new Date(Number(date))
    return moment(t).format('DD MMM YYYY, h:mm:ss a')
  }

  const getStatusChip = (status) => {
    switch (status) {
      case "PENDING":
        return <Chip color="error" size="small" label="Pending" />;
      case "CLOSED":
        return <Chip color="success" size="small" label="Closed" />;
      case "ASSIGNED":
        return <Chip color="primary" size="small" label="Assigned" />;
      case "OPENED":
        return <Chip color="info" size="small" label="Opened" />;
      case "INPROCESS":
        return <Chip color="warning" size="small" label="In Process" />;
      default:
        return <Chip size="small" label="--" />;
    }
  };

  const getKeyValue = (key) => {
    const item = selectedRequest[key];
    switch (key) {
      case "user": {
        return item || '--'
      }
      case "updatedAt":
        return format(item);
      case "createdAt":
        return format(item);
      case "status": {
        return getStatusChip(item);
      }
      default:
        return item || "--";
    }
  };

  const { loading, error, data, refetch } = useQuery(Support, {
    variables: {
      filter: {
        phone: '',
        status: status,
        request_type: type
      },
      pagination: {
        page: 0,
        limit: rowsPerPage,
      },
    },
  });

  const [updateSupport, { data: supportData }] = useMutation(
    updateService,
    {
      variables: {
        update: null,
        reqId: null,
      },
    }
  )

  const handlePagination = (page) => {
    refetch({
      filter: {
        phone: '',
        status: status,
        request_type: type
      },
      pagination: {
        page: page,
        limit: rowsPerPage,
      },
    });
  };

  useEffect(() => {
    const lists = get(data, "serviceRequests.docs", []);
    setReservations(lists);
  }, [loading, error, data, status]);

  const handleOpenEditModal = (item) => {
    console.log(item, 'item');
    setEditStatus(item.status);
    setEditType(item.request_type)
    setOpenModal(true);
  }

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const updateStatus = () => {
    const fields = {
      reqId: row.id,
      update: {
        status: editStatus,
        request_type: editType
      },
    };
    updateSupport({
      variables : fields
    })
  }

  useEffect(()=>{
    if(supportData){
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Request successfully updated",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      setOpenModal(false);
      handlePagination(1);
    }

  }, [supportData])

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
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{get(item, "name", "--")}</TableCell>
                  <TableCell>{get(item, "email", "--")}</TableCell>
                  <TableCell>{get(item, "phone", "--")}</TableCell>
                  <TableCell>
                    {get(item, "request_type", "--")}
                  </TableCell>
                  <TableCell>{get(item, "reason", '--')}</TableCell>
                  <TableCell>
                    {getStatusChip(get(item, "status", ""))}
                  </TableCell>
                  <TableCell>
                    {format(get(item, "updatedAt", ""))}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => { handleOpenEditModal(item); setRow(item) }}
                      aria-label="Edit"
                      size="small"
                    >
                      <ModeEditIcon fontSize="inherit" />
                    </IconButton>
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
            No service request found
          </div>
        </Card>
      )}
      <Card sx={{ display: "flex", justifyContent: "flex-end" }}>
        <CardContent>
          <span style={{ padding: "4px" }}> Page : </span>
          <Pagination
            count={get(data, "serviceRequests.pagination.totalPages", 1)}
            showFirstButton={get(
              data,
              "serviceRequests.pagination.hasPrevPage",
              false
            )}
            showLastButton={get(
              data,
              "serviceRequests.pagination.hasNextPage",
              false
            )}
            onChange={(e, page) => {
              handlePagination(page);
            }}
          />
        </CardContent>
      </Card>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="edit-corporate-modal-title"
        aria-describedby="edit-corporate-modal-description"
      >
        <Box
          sx={{
            ...style,
            width: "700px",
            maxHeight: "600px",
            overflowY: "scroll",
          }}
        >
          {error && <ErrorBox message="Please Enter all fields" />}
          <Card>
            <CardHeader subheader="Update status of the service request" title="Update Status" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <Status
                    statusList={defaultStatus}
                    status={editStatus}
                    setStatus={setEditStatus}
                    label='Status'
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Status
                    statusList={requestType}
                    status={editType}
                    setStatus={setEditType}
                    label='type'
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
            onClick={updateStatus}
          >
            UPDATE
          </Button>
        </Box>
      </Modal>
      <QueryTable
        open={openQueryTable}
        handleClose={handleClose}
        queryObject={selectedRequest}
        getUserName={userName}
        getQueryValue={getKeyValue}
      />
    </React.Fragment>
  );
};

export default Services;
