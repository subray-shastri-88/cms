import React from "react";
import { WithCpoCtx } from "../contexts/cpoContext";
import { DashboardLayout } from "../components/dashboard-layout";
import compose from "../utils/compose";
import { auth } from "../utils/ssrUtils";
import UserList from "src/components/endUsers.js";
import { Box, Container, Card, Typography } from "@mui/material";

const EndUser = () => {

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
                            End Users
                        </Typography>
                    </div>
                </Card>
                <Box
                    sx={{ marginTop: "10px", borderBottom: 1, borderColor: "divider" }}
                >
                    <Card
                        sx={{ position: "relative", margin: "0 25px", marginTop: "10px" }}
                    >
                        <UserList></UserList>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
};

const Users = WithCpoCtx(EndUser);

Users.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Users;
export const getServerSideProps = compose(auth);
