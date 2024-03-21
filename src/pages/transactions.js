import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Autocomplete,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Pagination,
} from "@mui/material";
import { get } from "lodash";
import { WithCpoCtx } from "../contexts/cpoContext";
import { DashboardLayout } from "../components/dashboard-layout";
import compose from "../utils/compose";
import { auth } from "../utils/ssrUtils";
import { getVehicles, getVM } from "../graphQL/vehicle";
import { useQuery, useLazyQuery } from "@apollo/client";
import { fetcher } from "src/utils/httpService";
import moment from "moment/moment";
import { OCPP } from '../utils/config';
import TablePagination from '@mui/material/TablePagination';

const Transaction = ({ data, pagination, handlePagination }) => {

    const [pg, setpg] = React.useState(0);
    const [rpg, setrpg] = React.useState(50);

    const handleChangePage = (event, newpage) => {
        setpg(newpage);
    }

    const handleChangeRowsPerPage = (event) => {
        setrpg(parseInt(event.target.value, 10));
        setpg(0);
    }

    const format = (date) => {
        return moment(date).format('DD MMM YYYY, h:mm:ss a')
    }

    console.log(data?.length, 'data');

    return (
        <Card sx={{ overflow: "auto" }}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Charger</TableCell>
                        <TableCell>Plug</TableCell>
                        <TableCell>Booking</TableCell>
                        <TableCell>Meter Start</TableCell>
                        <TableCell>Meter End</TableCell>
                        <TableCell>Start Time</TableCell>
                        <TableCell>Stop Time</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Reason</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data && data.slice(pg * rpg, pg * rpg + rpg)
                        .map((item) => {
                            return (
                                <TableRow key={item.id}>
                                    <TableCell>{item.cpid}</TableCell>
                                    <TableCell>{item.connectorid}</TableCell>
                                    <TableCell>{item.idtag}</TableCell>
                                    <TableCell>{item.meterstart}</TableCell>
                                    <TableCell>{item.meterstop}</TableCell>
                                    <TableCell>{format(item.starttimestamp)}</TableCell>
                                    <TableCell>{format(item.stoptimestamp)}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    <TableCell>{item.reason}</TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>

            <Card>
                <CardContent
                    sx={{ float: "right", display: "flex", flexDirection: "row" }}
                >
                    <span style={{ padding: "4px" }}> </span>
                    <TablePagination
                        rowsPerPageOptions={[50, 100,]}
                        component="div"
                        count={data?.length}
                        rowsPerPage={rpg}
                        page={pg}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </CardContent>
            </Card>
        </Card>
    );
};

const FullWidthTabs = () => {

    const [resData, setResData] = useState();
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(1000000000000);

    const totalTransactions = async () => {
        const res = await fetcher(
            `${OCPP.OCPP_HOST}/get-transactions?pageNumber=${page}&pageSize=${limit}`
        );
        if (res && res.data) {
            setResData(res.data.data)
            let count = res.data.data;

            console.log(count, 'res')
        }
    };

    useEffect(() => {
        totalTransactions();
    }, []);

    console.log(resData, 'res data')

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
                            Transactions
                        </Typography>
                    </div>
                </Card>
                <Box
                    sx={{ marginTop: "10px", borderBottom: 1, borderColor: "divider" }}
                >
                    <Card
                        sx={{ position: "relative", margin: "0 25px", marginTop: "10px" }}
                    >
                        <Transaction
                            data={resData}
                        />
                    </Card>
                </Box>
            </Container>
        </Box>
    );
};

const Transactions = WithCpoCtx(FullWidthTabs);

Transactions.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Transactions;
export const getServerSideProps = compose(auth);
