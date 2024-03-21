import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Card,
    IconButton,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableHead,
    Link,
    TableRow,
    Pagination,
} from "@mui/material";
import { get } from "lodash";
import { WithCpoCtx } from "../contexts/cpoContext";
import { DashboardLayout } from "../components/dashboard-layout";
import compose from "../utils/compose";
import { auth } from "../utils/ssrUtils";
import { fetcher } from "src/utils/httpService";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import moment from "moment";
import { OCPP } from "src/utils/config";
import QueryTable from "src/components/queryTable";

const Transaction = ({ data, pagination, handlePagination }) => {

    const [open, setOpen] = React.useState(false);
    const [openDetail , setOpneDetail] = React.useState(false);
    const [chargerId, setChargerId] = useState();
    const [selected, setSelected] = useState();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const format = (date) => {
        if (date !== null) {
            return moment(date).format('DD MMM YYYY, h:mm:ss a')
        } else {
            return '---'
        }

    }

    const boostNotification = async () => {
        const res = await fetcher(
            `${OCPP.OCPP_HOST}/get-bootnotifications?cpId='${chargerId}'`
        );
        if (res && res.data) {
            setSelected(res.data);
            console.log(res.data);
        }
    }

    useEffect(() => {
        boostNotification();
    }, [chargerId]);

    const getKeyValue = (key) => {
        const selectedBoot = selected.data[0]
        const item = selectedBoot[key];
        switch (key) {
            case "lastactive":
            case "lastheartbeat":   
                return format(item);
            default:
                return item;
        }
    };

    const handleOpen = () => {
        setOpneDetail(true);
    };
    const handleClose = () => {
        setOpneDetail(false);
    };

console.log(selected, 'selected');
    return (
        <React.Fragment>
            <TableRow key={data.cpId}>
                <TableCell><IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton></TableCell>
                <TableCell>{data.cpId}</TableCell>
                <TableCell>{data.state}</TableCell>
                <TableCell onClick={() => { setChargerId(data.cpId); handleOpen() }}>
                    <Link component="button">{format(data.lastBootNotification)}</Link>
                </TableCell>
                <TableCell>{format(data.lastHeartbeat)}</TableCell>
                <TableCell>{data.isAlive === true ? 'YES' : 'NO'}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Id</TableCell>
                                        <TableCell>Plug</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Error Code</TableCell>
                                        <TableCell>Updated At</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.connectors && data.connectors
                                        .map((item) => {
                                            return (
                                                <TableRow key={item.id}>
                                                    <TableCell>{item.id}</TableCell>
                                                    <TableCell>{item.connectorid}</TableCell>
                                                    <TableCell>{item.status}</TableCell>
                                                    <TableCell>{item.errorcode}</TableCell>
                                                    <TableCell>{format(item.timestamp)}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            <QueryTable
                open={openDetail}
                handleClose={handleClose}
                queryObject={selected && selected.data[0]}
                getQueryValue={getKeyValue}
            />
        </React.Fragment>
    );
};

const FullWidthTabs = () => {

    const [resData, setResData] = useState();
    const [charger, setCharger] = useState();
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(50);

    const totalTransactions = async () => {
        const res = await fetcher(
            `${OCPP.OCPP_HOST}/client-list`
        );
        if (res && res.data) {
            setResData(res.data)
            let count = res.data;
        }
    };

    useEffect(() => {
        totalTransactions();
    }, []);

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
                            Charge Point Status
                        </Typography>
                    </div>
                </Card>
                <Box
                    sx={{ marginTop: "10px", borderBottom: 1, borderColor: "divider" }}
                >
                    <Card
                        sx={{ position: "relative", margin: "0 25px", marginTop: "10px" }}
                    >
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>Charger</TableCell>
                                    <TableCell>State</TableCell>
                                    <TableCell>Last BootNotification</TableCell>
                                    <TableCell>Last Heartbeat</TableCell>
                                    <TableCell>Alive</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{ marginLeft: '20px' }}>
                                {resData && resData.map((row) => (
                                    <Transaction key={row.cpId} data={row} setCharger={row.cpId} />
                                ))}
                            </TableBody>
                        </Table>
                    </Card>

                </Box>
            </Container>
        </Box>
    );
};

const ChargePointStatus = WithCpoCtx(FullWidthTabs);

ChargePointStatus.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ChargePointStatus;
export const getServerSideProps = compose(auth);
