import React, { useState, useEffect } from "react";
import { Box, Container, Card, Typography, Tabs, Tab } from "@mui/material";
import { WithCpoCtx } from "../contexts/cpoContext";
import { DashboardLayout } from "../components/dashboard-layout";
import TabPanel, { a11yProps } from "../components/ui/TabPanel";
import compose from "../utils/compose";
import { auth } from "../utils/ssrUtils";
import TariffList from "../components/tariffs";
import NewTariff from "../components/tariffs/newTariff";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FullWidthTabs = ({ allPartners, loadAllCpos }) => {
  useEffect(() => {
    loadAllCpos();
  }, []);

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
      <Container maxWidth="50%">
        <Card sx={{ position: "relative",display:'flex' }}>
          <Typography sx={{ m: 2 }} variant="h4">
            Tariff Management
          </Typography>
          <NewTariff allPartners={allPartners} />
        </Card>
        <div
          style={{
            maxHeight: "600px",
            overflowY: "auto",
            marginTop: "10px",
          }}
        >
          {allPartners.map((item) => (
            <Accordion
              key={item.id}
              sx={{ marginTop: "3px", marginBottom: "0px !important" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>{item.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TariffList cpoId={item.id} />
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </Container>
    </Box>
  );
};

const Tariffs = WithCpoCtx(FullWidthTabs);

Tariffs.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Tariffs;
export const getServerSideProps = compose(auth);
