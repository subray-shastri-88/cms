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
import { getUserWallet } from "src/graphQL/wallet";
import UserWallet from "src/components/wallet/userWallet";

const EndUserPage = () => {
  const router = useRouter();
  const { id: userId } = router.query;
  const [wallet , setWallet ] = useState();

  const [getUserWalletList, { data: userWalletList, refetch }] = useLazyQuery(
    getUserWallet,
    {
      variables: {
        userId: userId
      },
    }
  );

  useEffect(() => {
    if (userId) {
      getUserWalletList();
    }
  }, [userId]);

  useEffect(() => {
    const data = get(userWalletList, "Wallet", "");
    setWallet(data);
  }, [userWalletList]);

  if(wallet && wallet !== undefined){
    console.log(wallet.credit , 'wallet')
  }

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
              User Wallet Dashboard
            </Typography>
          </div>
        </Card>
        <UserWallet data={wallet} userId={userId} />
      </Container>
    </Box>
  );
};

const Users = WithCpoCtx(EndUserPage);

Users.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Users;
