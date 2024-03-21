import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Autocomplete,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Pagination,
} from "@mui/material";
import { get } from "lodash";
import { WithCpoCtx } from "../contexts/cpoContext";
import { DashboardLayout } from "../components/dashboard-layout";
import TabPanel, { a11yProps } from "../components/ui/TabPanel";
import compose from "../utils/compose";
import { auth } from "../utils/ssrUtils";
import PlugManagement from "../components/machines/Plugs";
import MakeAndModel from "../components/machines/MakeAndModel";
import NewManufacturer from "../components/vehicles/manufacturer";
import NewVehicle from "../components/vehicles/new-vehicle";
import { getVehicles, getVM } from "../graphQL/vehicle";
import { useQuery, useLazyQuery } from "@apollo/client";

const Vehicle = ({ data, vms, pagination, handlePagination }) => {
  const getManufacturer = (id) => {
    const vm = vms.find((item) => item.id === id);
    return vm?.name || "";
  };

  return (
    <Card sx={{ overflow: "auto" }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Model Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Manufacturer</TableCell>
            <TableCell>Charging Modes</TableCell>
            <TableCell>Plugs</TableCell>
            <TableCell>KW</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data
            .filter((item) => item.type !== null)
            .map((item) => {
              return (
                <TableRow key={item.name}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{getManufacturer(item.manufacturerId)}</TableCell>
                  <TableCell>{item.powerType.join(",")}</TableCell>
                  <TableCell>{item.supportedPorts.join(",")}</TableCell>
                  <TableCell>{item.maxPower}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>

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
    </Card>
  );
};

const FullWidthTabs = ({ loadAllCpos, cpos }) => {
  const [vehicleModels, setVehicleModels] = useState();
  const [type, setType] = useState("");
  const [vms, setVms] = useState([]);
  const [selectedMake, setMake] = useState();
  const [currentPage, setCurrentPage] = useState();

  const filterVmTypes = (data) => {
    const list = data.filter((item) => item.type.some((r) => type.includes(r)));
    setVms(list);
  };

  const [getVehicleList, { loading, error, data, refetch: fetchVehicleList }] =
    useLazyQuery(getVehicles, {
      variables: {
        pagination: {
          limit: 10,
          page: 0,
        },
        filter: {
          manufacturerId: null,
          type: null,
        },
      },
    });

  const fetchData = () => {
    let filters = {
      type: null,
    };
    type && type.length > 0 ? (filters.type = type) : "";
    selectedMake && selectedMake.length > 0
      ? (filters.manufacturerId = selectedMake.map((item) => item.id))
      : "";
    fetchVehicleList({
      pagination: {
        limit: 10,
        page: currentPage || 1,
      },
      filter: filters,
    });
  };

  const { data: vmData } = useQuery(getVM, {
    filter: {
      query: "",
    },
  });

  useEffect(() => {
    if (type) {
      filterVmTypes(get(vmData, "VehicleManufacturer", []));
    }
  }, [type, vmData]);

  useEffect(() => {
    if (data) {
      setVehicleModels(get(data, "VehicleModels"));
    }
  }, [data]);

  useEffect(() => {
    if (selectedMake || type || currentPage) {
      fetchData();
    }
  }, [selectedMake, type, currentPage]);

  useEffect(() => {
    getVehicleList();
  }, [getVehicleList]);

  // useEffect(() => {
  //   if (type) {
  //     refetch({
  //       pagination: {
  //         limit: 100,
  //         page: 0
  //       },
  //       filter: {
  //         manufacturerIds: selectedMake || null,
  //         type: type
  //       }
  //     });
  //   }
  // }, [selectedMake, type]);

  const vehiclesType = ["2W", "3W", "LMV", "HMV"];

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 3,
        overflow: "auto",
      }}
    >
      <Container maxWidth="xl">
        <Card sx={{ position: "relative", margin: "0 25px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ m: 3 }} variant="h4">
              Vehicle Management
            </Typography>
          </div>
        </Card>
        <Box
          sx={{ marginTop: "10px", borderBottom: 1, borderColor: "divider" }}
        >
          <Card sx={{ position: "relative", margin: "0 25px" }}>
            <div
              style={{
                display: "flex",
                padding: "10px",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <Autocomplete
                  size="small"
                  multiple
                  limitTags={1}
                  options={vehiclesType}
                  onChange={(event, value) => setType(value)}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      label="Type"
                      sx={{ mx: 1 }}
                    />
                  )}
                  sx={{ mx: 1, width: "200px" }}
                />
                <Autocomplete
                  size="small"
                  multiple
                  limitTags={1}
                  options={vms}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => setMake(newValue)}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      label="Manufacturer"
                      sx={{ mx: 2 }}
                    />
                  )}
                  sx={{ mx: 1, width: "250px" }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <NewVehicle fetchData={fetchData} />
                <NewManufacturer />
              </div>
            </div>
          </Card>

          <Card
            sx={{ position: "relative", margin: "0 25px", marginTop: "10px" }}
          >
            <Vehicle
              data={vehicleModels ? vehicleModels.docs : []}
              vms={get(vmData, "VehicleManufacturer", [])}
              pagination={vehicleModels ? vehicleModels.pagination : {}}
              handlePagination={(page) => setCurrentPage(page)}
            />
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

const Vehicles = WithCpoCtx(FullWidthTabs);

Vehicles.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Vehicles;
export const getServerSideProps = compose(auth);
