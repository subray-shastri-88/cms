import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { get } from "lodash";
import { Box, Container, Card, Typography } from "@mui/material";
import { DashboardLayout } from "../../../components/dashboard-layout";
import DriverList from "../../../components/corporate/DriverList";
import NewDriver from "../../../components/addNewPartner/driver";
import { WithCpoCtx } from "../../../contexts/cpoContext";
import { useLazyQuery } from "@apollo/client";
import { getCorporate, getDriverList } from "../../../graphQL/corporate";
import { CorporateDetail } from "../../corporate/[id]";

const Drivers = () => {
  const router = useRouter();
  const { id: partnerId } = router.query;
  const [trigger, setTrigger] = useState(false);

  const [corporate, setCorporate] = useState({});

  const [getCorporateData, { data: corpData, loading }] = useLazyQuery(
    getCorporate,
    {
      variables: {
        corporateId: partnerId,
      },
    }
  );

  useEffect(() => {
    if (partnerId) {
      getCorporateData();
    }
  }, [partnerId]);

  useEffect(() => {
    const data = get(corpData, "Corporate", "");
    setCorporate(data);
  }, [corpData]);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 2,
      }}
    >
      <Container maxWidth={"xl"}>
        <Card sx={{ position: "relative", mx: "25px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ m: 3 }} variant="h4">
              Corporate Dashboard
            </Typography>
          </div>

          <NewDriver
            header="Onboard New Driver"
            corporate={corporate}
            fetch={() => setTrigger(true)}
          />
        </Card>
        {partnerId && !loading && (
          <CorporateDetail
            corpId={partnerId}
            trigger={trigger}
            driverBaseUrl={`/corporate-partner/${partnerId}`}
            corporate={corporate}
          />
        )}
      </Container>
    </Box>
  );
};

Drivers.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Drivers;
