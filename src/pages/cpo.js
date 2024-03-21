import React, { useState, useEffect } from "react";
import Head from "next/head";
import {
  Box,
  Container,
  Card,
  Typography,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { DashboardLayout } from "../components/dashboard-layout";
import Listings from "../components/operators/Listing";
import TabPanel from "../components/ui/TabPanel";
import Operator from "../components/operators/Operator";
import Payouts from "../components/operators/Payouts";
import NewPartner from "../components/addNewPartner/partner";
import compose from "../utils/compose";
import { auth } from "../utils/ssrUtils";

const CPO = () => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState([]);

  async function fetchUserData() {
    try {
      const response = await fetch("your_api_endpoint_here");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
  useEffect(() => {
    fetchUserData()
      .then((data) => {
        let lists = get(data, "Users.docs", []).filter((item) => item.id);
        setUserList(lists);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 3,
        "@media (max-width: 600px)": {
          padding: "1rem",
        },
        "@media (min-width: 601px) and (max-width: 1024px)": {
          padding: "2rem",
        },
      }}
    >
      <Container maxWidth={"xl"}>
        <Card sx={{ position: "relative", mx: "2%", padding: "1%" ,display:'flex'}}>
          <Typography sx={{ m: "1%" }} variant="h4">
            Charge Point Operators - CPO
          </Typography>
          {value === 0 && (
            <NewPartner defaultType="CPO" header="New Charge Point Operator" />
          )}
        </Card>
        <Box sx={{ mt: "1%", display: "flex" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{
              marginLeft: "2%",
              marginTop: "2%",
              borderRadius: "1%",
              backgroundColor: "#fff",
              height: "74vh",
            }}
            orientation="vertical"
            variant="scrollable"
          >

            {/* <Tab sx={{ paddingX: "30px" }} label="Overview" />
            <Tab sx={{ paddingX: "30px" }} label="Operator" />
            <Tab sx={{ paddingX: "30px" }} label="Transaction" /> */}

            <Tab sx={{ paddingX: '30px' }} label="Overview" />
            <Tab sx={{ paddingX: '30px' }} label="Analytics" />
            {/* <Tab sx={{ paddingX: '30px' }} label="Payouts" /> */}
            {/* <Tab sx={{ paddingX: '30px' }} label="Transactions" /> */}

          </Tabs>
          <TabPanel value={value} index={0}>
            <Listings type="CPO" />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Operator />
          </TabPanel>
          {/* <TabPanel value={value} index={2}>
            <Payouts />
          </TabPanel> */}
        </Box>
      </Container>
    </Box>
  );
};

CPO.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CPO;
export const getServerSideProps = compose(auth);
