import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { get } from "lodash";
import { Box, Container, Card, Typography, Button } from "@mui/material";
import { DashboardLayout } from "../../components/dashboard-layout";
import DriverList from "../../components/corporate/DriverList";
import NewDriver from "../../components/addNewPartner/driver";
import { WithCpoCtx } from "../../contexts/cpoContext";
import { useLazyQuery } from "@apollo/client";
import { getCorporate, getDriverList } from "../../graphQL/corporate";

const CorporateDetail = ({
  corpId: partnerId,
  trigger,
  driverBaseUrl = "/corporate",
  corporate,
}) => {
  const [drivers, setDrivers] = useState([]);
  const [pagination, setPagination] = useState();

  const [getDriverListData, { data: driversList, refetch }] = useLazyQuery(
    getDriverList,
    {
      variables: {
        pagination: {
          page: 0,
          limit: 10,
        },
        filter: {
          corporateId: partnerId,
        },
      },
    }
  );

  useEffect(() => {
    if (partnerId) {
      getDriverListData();
    }
  }, [partnerId]);

  const paginateDriversList = (page = 0, id) => {
    refetch({
      pagination: {
        page: page,
        limit: 10,
      },
      filter: {
        corporateId: partnerId,
      },
    });
  };

  useEffect(() => {
    if (trigger) {
      paginateDriversList();
    }
  }, [trigger]);

  useEffect(() => {
    const data = get(driversList, "Drivers.docs", []);
    setPagination(get(driversList, "Drivers.pagination", {}));
    setDrivers(data);
  }, [driversList]);

  return (
    <Card
      sx={{
        position: "relative",
        marginTop: "30px",
        mx: "25px",
        paddingTop: "20px",
      }}
    >
      <DriverList
        drivers={drivers}
        onPagination={paginateDriversList}
        pagination={pagination}
        corporate={corporate}
        driverBaseUrl={driverBaseUrl}
      />
    </Card>
  );
};

export { CorporateDetail };

const CorporatePage = () => {
  const router = useRouter();
  const { id: corpId } = router.query;
  const [trigger, setTrigger] = useState(false);
  const [corporate, setCorporate] = useState({});
  const [getCorporateData, { data: corpData }] = useLazyQuery(getCorporate, {
    variables: {
      corporateId: corpId,
    },
  });

  useEffect(() => {
    if (corpId) {
      getCorporateData();
    }
  }, [corpId]);

  useEffect(() => {
    const data = get(corpData, "Corporate", "");
    setCorporate(data);
  }, [corpData]);

  const handleDownload = () => {
    // Check if the invoice link exists in the corporate data
    if (corporate && corporate.invoice) {
      // Open the invoice link in a new tab
      window.open(corporate.invoice, "_blank");
    } else {
      // Handle the case when the invoice link is not available
      console.log("Invoice link is not available.");
    }
  };

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
          {/* <Button
            color="primary"
            variant="contained"
            onClick={handleDownload}
            sx={{ position: "absolute", top: "25px", right: 220 }}
          >
            Download Invoice
          </Button> */}
          <NewDriver
            header="Onboard New Driver"
            corporate={corporate}
            fetch={() => setTrigger(true)}
          />
          <NewDriver
            header="Onboard New Driver"
            corporate={corporate}
            fetch={() => setTrigger(true)}
          />
        </Card>
        <CorporateDetail
          corpId={corpId}
          trigger={trigger}
          driverBaseUrl={`/corporate`}
          corporate={corporate}
        />
      </Container>
    </Box>
  );
};

const CorporatesPage = WithCpoCtx(CorporatePage);

CorporatesPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CorporatesPage;
