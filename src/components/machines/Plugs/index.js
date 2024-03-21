import React, { useState, useEffect } from "react";
import { get } from "lodash";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useMutation, useQuery } from "@apollo/client";
import { getPortTypes, deletePlugType } from "../../../graphQL/machines/plugs";
import NewPlug from "./newPlug";
import Ring from "../../ui/Loader/Ring";
import Pagination from "@mui/material/Pagination";

const PlugManagement = () => {
  const PAGE_SIZE = 10;
  const { data, loading, refetch } = useQuery(getPortTypes);
  const [portTypes, setPortTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const [plugToEdit, setPlugToEdit] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [deletePlug, { loading: loading1 }] = useMutation(deletePlugType, {
    variables: {
      id: "CCS",
    },
  });

  const handleEditPlug = (plug) => {
    setPlugToEdit(plug);
  };

  useEffect(() => {
    setPortTypes(get(data, "PortTypes", []));
  }, [data]);

  useEffect(() => {
    if (!open) {
      setPlugToEdit();
      refetch();
    }
  }, [open]);

  useEffect(() => {
    if (plugToEdit) {
      setOpen(true);
    }
  }, [plugToEdit]);

  const handleStatusChange = async (id, newStatus) => {
    await deletePlug({
      variables: {
        id: id,
      },
    });

    refetch();
  };

  const totalPages = Math.ceil(portTypes.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const visiblePortTypes = portTypes.slice(startIndex, endIndex);

  return (
    <Card>
      <CardContent>
        {/* {(loading || loading1) && <Ring />} */}

        <Box
          sx={{
            padding: "0 20px 20px",
            display: "flex",
            alignItems: "center",
            flex: "1",
            justifyContent: "flex-end",
            "@media (max-width: 600px)": {
              padding: "1rem",
            },
            "@media (min-width: 601px) and (max-width: 1024px)": {
              padding: "2rem",
            },
          }}
        >
          <Button
            onClick={() => setOpen(true)}
            loadingPosition="end"
            variant="contained"
            size="small"
          >
            Add Plug
          </Button>
        </Box>

        <NewPlug open={open} setOpen={setOpen} plug={plugToEdit} />

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Display Name</TableCell>
              <TableCell>Supported Power (KW)</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visiblePortTypes.map((port, index) => (
              <TableRow key={index}>
                <TableCell>{port.id}</TableCell>
                <TableCell>{port.name}</TableCell>
                <TableCell>{port.supportedPowers.join()}</TableCell>
                <TableCell>{port.type}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditPlug(port)}
                    aria-label="Add New Machine"
                    size="small"
                  >
                    <ModeEditIcon fontSize="inherit" aria-label="Edit" />
                  </IconButton>
                </TableCell>

                {/* <TableCell
                  value={port.id}
                  onClick={() => handleStatusChange(item.id)}
                  selected={port.status === "active"}
                >
                  {port.status === "active" ? "Active" : "Inactive"}
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, page) => setCurrentPage(page)}
            variant="outlined"
            shape="rounded"
          />
        </Box> */}
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
              count={totalPages}
              page={currentPage}
              onChange={(event, page) => setCurrentPage(page)}
            />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default PlugManagement;
