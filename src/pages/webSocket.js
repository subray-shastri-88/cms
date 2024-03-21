import React, { useState, useCallback, useEffect } from 'react';
import { WithCpoCtx } from "../contexts/cpoContext";
import { DashboardLayout } from "../components/dashboard-layout";
import compose from "../utils/compose";
import { auth } from "../utils/ssrUtils";
import UserList from "src/components/endUsers.js";
import { Box, Container, Card, Typography } from "@mui/material";
// import useWebSocket, { ReadyState } from 'react-use-websocket';

const Soc = () => {

    // const [socketUrl, setSocketUrl] = useState('ws://34.100.236.134:8080/ocpp/16/CH-002');
    // const [messageHistory, setMessageHistory] = useState([]);

    // const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    // useEffect(() => {
    //     if (lastMessage !== null) {
    //         setMessageHistory((prev) => prev.concat(lastMessage));
    //     }
    // }, [lastMessage, setMessageHistory]);


    // const connectionStatus = {
    //     [ReadyState.CONNECTING]: 'Connecting',
    //     [ReadyState.OPEN]: 'Open',
    //     [ReadyState.CLOSING]: 'Closing',
    //     [ReadyState.CLOSED]: 'Closed',
    //     [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    // }[readyState];

    // console.log(readyState, 'state');
    // console.log(lastMessage, 'data');

    // const handleClickSendMessage = useCallback(() => sendMessage('Hello'), []);

    // const socketUrl = 'wss://echo.websocket.org';

// const {
//   sendMessage,
//   sendJsonMessage,
//   lastMessage,
//   lastJsonMessage,
//   readyState,
//   getWebSocket,
// } = useWebSocket(socketUrl, {
//   onOpen: () => console.log('opened'),
//   //Will attempt to reconnect on all close events, such as server shutting down
//   shouldReconnect: (closeEvent) => true,
// });

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
                            SOC
                        </Typography>
                    </div>
                </Card>
                <Box
                    sx={{ marginTop: "10px", borderBottom: 1, borderColor: "divider" }}
                >
                    <Card
                        sx={{ position: "relative", margin: "0 25px", marginTop: "10px" }}
                    >
                        {/* <div>
                            <span>The WebSocket is currently {connectionStatus}</span>
                            {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
                            <ul>
                                {messageHistory.map((message, idx) => (
                                    <span key={idx}>{message ? message.data : null}</span>
                                ))}
                            </ul>
                        </div> */}

                    </Card>
                </Box>
            </Container>
        </Box>
    );
};

const SocPage = WithCpoCtx(Soc);

SocPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SocPage;
export const getServerSideProps = compose(auth);
