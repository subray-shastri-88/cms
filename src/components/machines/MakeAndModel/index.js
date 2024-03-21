import React, { useState, useEffect } from "react";
import { get } from "lodash";
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  Button,
  Modal,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Pagination,
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useQuery, useMutation } from "@apollo/client";
import { getMachines } from "../../../graphQL/machines/makes";
import NewMachine from "./machine";
import UpdateMachine from "./editMachine";
import NewManufacturer from "./manufacturer";

const MakeAndModel = ({ allPartners }) => {
  const [machines, setMachines] = useState([]);
  const [openMachine, setOpenMachine] = useState(false);
  const [open, setOpen] = useState(false);
  const { data, loading, error, refetch } = useQuery(getMachines, {
    variables: {
      filter: {
        query: null,
        cpoId: "",
      },
      pagination: {
        page: 1,
        limit: 10,
      },
    },
  });
  const [cpo, setCpo] = useState();

  const [selectedMachine, setSelectedMachine] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedOcppVersion, setEditedOcppVersion] = useState("");
  const [editedStatus, setEditedStatus] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    const dt = get(data, "Machines.docs", []);
    setMachines(dt);
  }, [data]);

  const OCPP = {
    V_1_6: "1.6",
    V_2_0: "2.0",
  };

  const handleEditModalClose = () => {
    setSelectedMachine(null);
    setEditModalOpen(false);
  };

  // const handleEditClick = (machine) => {
  //   setSelectedMachine(machine);
  //   setEditedName(machine.name);
  //   setEditedOcppVersion(machine.charger?.ocppVersion || "");
  //   setEditedStatus(machine.active ? "active" : "inactive");
  //   setEditModalOpen(true);
  // };

  const handleEditClick = (machine) => {
    setSelectedMachine(machine);
    setOpenMachine(true);
  };
  const handleUpdate = async () => {
    if (selectedMachine) {
      try {
        UpdateMachine({
          variables: {
            id: selectedMachine.id,
            name: editedName,
            ocppVersion: editedOcppVersion,
            status: editedStatus,
          },
        });

        // Close the edit modal and refetch the machines
        handleEditModalClose();
        refetch();
      } catch (error) {
        // Handle error
        console.error("Error updating machine:", error);
      }
    }
  };

  const handleCpoChange = (val) => {
    if (val && val.id) {
      refetch({
        filter: {
          query: null,
          cpoId: val.id,
        },
      });
    } else {
      refetch({
        filter: {
          query: null,
        },
      });
    }
    setCpo(val);
  };

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handlePagination = (page) => {
    if(cpo && cpo.id){
      refetch({
        filter: {
          query: null,
          cpoId: cpo.id,
        },
        pagination: {
          page: page,
          limit: 10,
        },
      });
    }else{
      refetch({
        filter: {
          query: null,
          cpoId: '',
        },
        pagination: {
          page: page,
          limit: 10,
        },
      });
    }

  };


  useEffect(() => {
    const dt = get(data, "Machines.docs", []);
    setMachines(dt);
  }, [data]);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // const totalPages = Math.ceil(machines.length / itemsPerPage);

  const displayedMachines = machines.slice(startIndex, endIndex);
  return (
    <Card>
      <CardContent>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Autocomplete
            size="small"
            limitTags={1}
            options={allPartners}
            onChange={(event, value) => handleCpoChange(value)}
            renderInput={(params) => (
              <TextField
                size="small"
                {...params}
                label="Partner"
                sx={{ mx: 1 }}
              />
            )}
            sx={{ mx: 1, width: "200px" }}
          />
          <NewMachine fetchMachines={refetch} />
          <NewManufacturer />
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
              width: "50vw",
              margin: "auto",
              overflowY: "scroll",
              height: "900px",
            }}
          >
            <div style={{ display: "flex", height: "400px" }}></div>
          </Modal>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "20px",
            margin: "20px 0px",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Partner</TableCell>
                <TableCell>Machine Name</TableCell>
                <TableCell>Manufacturer</TableCell>
                <TableCell>Ocpp Version</TableCell>
                <TableCell>No of Plugs</TableCell>
                <TableCell>Plug Names</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {machines.map((machine, index) => (
                <TableRow key={index}>
                  <TableCell>{get(machine, "cpo.name", "--")}</TableCell>
                  <TableCell>{machine.name}</TableCell>
                  <TableCell>{get(machine, "make.name", "--")}</TableCell>
                  <TableCell>
                    {OCPP[get(machine, "charger.ocppVersion", "")]}
                  </TableCell>
                  <TableCell>
                    {get(machine, "charger.plugs", []).length}
                  </TableCell>
                  <TableCell>
                    {get(machine, "charger.plugs", []).map(
                      (item) => item.supportedPort + ", "
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        machine.status === "ACTIVE" ? "Active" : "Deactivated"
                      }
                      size="small"
                      variant="filled"
                      color={machine.status === "ACTIVE" ? "success" : "error"}
                    />
                  </TableCell>
                  <TableCell>
                    <UpdateMachine
                      fetchMachines={refetch}
                      selectedMachine={selectedMachine}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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
              count={get(data, "Machines.pagination.totalPages", 1)}
              showFirstButton={get(
                data,
                "Machines.pagination.hasPrevPage",
                false
              )}
              page={get(data, "Machines.pagination.page", 1)}
              showLastButton={get(data, "Machines.pagination.hasNextPage", false)}
              onChange={(e, page) => {
                setPage(page);
                handlePagination(page);
              }}
            />
          </CardContent>
        </Card>
      </CardContent>
      <Dialog open={editModalOpen} onClose={handleEditModalClose}>
        <DialogTitle>Edit Machine</DialogTitle>
        <DialogContent>
          {selectedMachine && (
            <div>
              <TextField
                label="Partner"
                value={selectedMachine.cpo ? selectedMachine.cpo.name : ""}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Machine Name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                sx={{ marginBottom: 2 }}
              />

              <TextField
                label="Manufacturer"
                value={selectedMachine.make ? selectedMachine.make.name : ""}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="OCPP Version"
                value={editedOcppVersion}
                onChange={(e) => setEditedOcppVersion(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="No of Plugs"
                value={
                  selectedMachine.charger
                    ? selectedMachine.charger.plugs.length
                    : ""
                }
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Plug Names"
                value={
                  selectedMachine.charger
                    ? selectedMachine.charger.plugs
                        .map((item) => item.supportedPort)
                        .join(", ")
                    : ""
                }
                sx={{ marginBottom: 2 }}
              />
              <FormControl sx={{ marginBottom: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditModalClose}>Cancel</Button>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default MakeAndModel;
