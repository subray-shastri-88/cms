import React, { useState, useEffect } from "react";
import { Box, Card, Chip, Typography, Grid, CardContent, CardHeader, Table, TableHead, TableRow, Pagination, TableCell, TableBody } from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import moment from "moment/moment";
import { round, get } from 'lodash';
import { useLazyQuery } from "@apollo/client";
import { walletTransaction } from "src/graphQL/wallet";

const HighLight = ({
    label,
    value,
    valueStyle = {},
    labelStyle = {},
    textSecondaryLabel,
    actionItem,
}) => {
    return (
        <Card elevation={11}>
            <CardHeader
                sx={{
                    paddingX: {
                        xs: "10px !important",
                        sm: "10px !important",
                        md: "10px !important",
                        lg: "15px !important",
                    },
                    paddingTop: {
                        xs: "10px !important",
                        sm: "10px !important",
                        md: "10px !important",
                        lg: "15px !important",
                    },
                    paddingBottom: "0px !important",
                }}
                title={label}
                action={actionItem && actionItem}
            />
            <CardContent
                sx={{
                    paddingY: "10px !important",
                    padding: {
                        xs: "10px !important",
                        sm: "10px !important",
                        md: "10px !important",
                        lg: "15px !important",
                    },
                }}
                md={{ padding: "10px !important" }}
            >
                <Typography color="textPrimary" variant="h4" sx={valueStyle}>
                    {value}
                </Typography>
                {textSecondaryLabel && (
                    <Typography color="textSecondary" variant="caption">
                        {textSecondaryLabel}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

const UserWallet = ({ data, userId }) => {

    const [userwalletTransaction, setuserWalletTransaction] = useState();
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [getWalletTransaction, { data: transaction, error, refetch }] = useLazyQuery(walletTransaction, {
        variables: {
            filter: {
                userId: userId,
            },
            pagination: {
                page: 0,
                limit: rowsPerPage,
            },
        },
    });

    useEffect(() => {
        if (userId) {
            getWalletTransaction();
        }
    }, [userId]);

    useEffect(() => {
        const data = get(transaction, "WalletTransaction.docs", "");
        setuserWalletTransaction(data);
        console.log(data, 'data')
    }, [transaction]);

    const handledPagination = (page) => {
        refetch({
            filter: {
                userId: userId,
            },
            pagination: {
                page: page,
                limit: rowsPerPage,
            },
        });
    };

    const format = (date) => {
        const d = new Date(date * 1)
        console.log(d)
        return moment(d).format('DD MMM YYYY, h:mm:ss a')
    }

    const getStatusChip = (status) => {
        switch (status) {
            case "PENDING":
                return <Chip color="warning" size="small" label="Pending" />;
            case "COMPLETED":
                return <Chip color="success" size="small" label="Completed" />;
            case "RESERVED":
                return <Chip color="primary" size="small" label="Reserved" />;
            case "RUNNING":
                return <Chip color="info" size="small" label="Running" />;
            case "CANCELLED":
                return <Chip color="error" size="small" label="Canceled" />;
            default:
                return <Chip size="small" label="--" />;
        }
    };

    return (
        <Card sx={{
            position: "relative",
            marginTop: "30px",
            mx: "25px",
            paddingTop: "20px",
        }}>
            <Grid container spacing={3} sx={{ padding: "15px" }}>
                <Grid item xl={3} lg={3} sm={3} xs={12}>
                    <HighLight
                        label={"User"}
                        value={data?.user?.name || ''}
                    />
                </Grid>
                <Grid item xl={3} lg={3} sm={3} xs={12}>
                    <HighLight
                        label={"Credit"}
                        value={'₹ ' + data?.credit || 0}
                    />
                </Grid>
                <Grid item xl={3} lg={3} sm={3} xs={12}>
                    <HighLight
                        label={"Reserved"}
                        value={'₹ ' + data?.reserved || 0}
                    />
                </Grid>
                <Grid item xl={3} lg={3} sm={3} xs={12}>
                    <HighLight
                        label={"Total"}
                        value={'₹ ' + data?.totalAmount || 0}
                    />
                </Grid>
            </Grid>
            <Grid item lg={12} md={12} xl={9} xs={12}>
                <Card>
                    <PerfectScrollbar>
                        <Box>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Id</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Consumed Amount</TableCell>
                                        <TableCell>Reason</TableCell>
                                        <TableCell>Reserved</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {userwalletTransaction && userwalletTransaction.map((item) => {
                                        return (
                                            <TableRow key={item._id}>
                                                <TableCell>{item._id}</TableCell>
                                                <TableCell>{item.type}</TableCell>
                                                <TableCell>₹ {item.amount}</TableCell>
                                                <TableCell>₹ {round(item.consumedAmount, 2)}</TableCell>
                                                <TableCell>{item.reason}</TableCell>
                                                <TableCell align="left">
                                                    <Chip
                                                        label={(item.reserved) === false ? 'False' : 'True'}
                                                        size="small"
                                                        variant="filled"
                                                        color={
                                                            (item.reserved) === false ? 'warning' : 'success'
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>{getStatusChip(item.status)}</TableCell>
                                                <TableCell>{format(item.createdAt)}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Box>
                        {userwalletTransaction === undefined && (
                            <Card>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "150px",
                                        width: "100%",
                                    }}
                                >
                                    No Transactions found
                                </div>
                            </Card>
                        )}
                        <Card sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <CardContent>
                                <span style={{ padding: "4px" }}> Page : </span>
                                <Pagination
                                    count={get(transaction, "WalletTransaction.pagination.totalPages", 1)}
                                    showFirstButton={get(
                                        transaction,
                                        "WalletTransaction.pagination.hasPrevPage",
                                        false
                                    )}
                                    showLastButton={get(
                                        transaction,
                                        "WalletTransaction.pagination.hasNextPage",
                                        false
                                    )}
                                    onChange={(e, page) => {
                                        handledPagination(page);
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </PerfectScrollbar>
                </Card>
            </Grid>
        </Card>

    );
}

export default UserWallet;