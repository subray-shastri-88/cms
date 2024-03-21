import React, { useEffect, useState } from "react";
import { get } from "lodash";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    TablePagination,
    Card,
    Button,
    CardContent,
    Chip,
    IconButton,
    FormControl,
    Pagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from "@mui/material";
import userApis from "src/graphQL/users";
import { useMutation, useQuery } from "@apollo/client";
import InfoIcon from "@mui/icons-material/Info";
import QueryTable, { TableBuilder } from "../queryTable";
import { UserKind } from "src/utils/config";
import { round } from 'lodash';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { UserStatus } from "src/utils/config";


const UserList = () => {
    const { getUsers, deleteUser, ToggleUserStatus } = userApis;
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [userList, setUserList] = useState();
    const [openQueryTable, setOpenQueryTable] = useState(false);
    const [selectedUser, setSelectedUser] = useState({})
    const [selectedRow, setSelectedRow] = useState();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickClose = () => {
        setOpen(false);
    };

    const { error, refetch, data } = useQuery(getUsers, {
        variables: {
            filter: {
                kind: UserKind.END_USER,
            },
            pagination: {
                page: 0,
                limit: rowsPerPage,
            },
        },
    });

    const [deleteSelectedUser, { error: deleteError, refetch: userRefetch,  deleteData }] = useMutation(
        deleteUser,
        {
            variables: {
                input: {
                    phone: selectedRow?.phone,
                    role: selectedRow?.kind
                }
            }
        }
    );

    const [changeUserStatus , {data: toggleData}] = useMutation(
        ToggleUserStatus,
        {
            variables:{
                userId: selectedRow?.id,
                status: UserStatus.INACTIVE
            }
        }
    )

    const callDeleteUser = () => {
        deleteSelectedUser();
        changeUserStatus();
        refetch({
            filter: {
                kind: UserKind.END_USER,
            },
            pagination: {
                page: 1,
                limit: rowsPerPage,
            },
        });
    }

    const handlePagination = (page) => {
        refetch({
            filter: {
                kind: UserKind.END_USER,
            },
            pagination: {
                page: page,
                limit: rowsPerPage,
            },
        });
    };

    useEffect(() => {
        if (data && data !== undefined) {
            const list = get(data, "Users.docs", []);
            setUserList(list);
        }
    }, [data])

    const handleOpen = (item) => {
        setSelectedUser(item);
        setOpenQueryTable(true);
    };

    const handleClose = () => {
        setOpenQueryTable(false);
    };

    const getUKeyValue = (mainKey, key) => {
        const item = selectedUser[mainKey][key] || "--";
        switch (key) {
            default:
                return item;
        }
    };

    const getKeyValue = (key) => {
        const item = selectedUser[key];
        switch (key) {
            case "wallet": {
                const { __typename, ...rest } = item;
                return (
                    <TableBuilder
                        item={rest}
                        getQueryValue={(val) => getUKeyValue("wallet", val)}
                    />
                );
            }
            case "preference": {

                const { __typename, ...rest } = item;
                return (
                    <TableBuilder
                        item={rest}
                        getQueryValue={(val) => getUKeyValue("preference", val)}
                    />
                );
            }
            default:
                return item || "--";
        }
    };

    console.log(selectedRow, 'row');

    return (
        <React.Fragment>
            {/* {loading && <Ring />} */}
            <Box
                sx={{
                    overflowX: "auto",
                    "@media (max-width: 600px)": {
                        padding: "1rem",
                    },
                    "@media (min-width: 601px) and (max-width: 1024px)": {
                        padding: "2rem",
                    },
                }}
            >
                <Table sx={{ minWidth: 650 }} size="medium">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>User Name</TableCell>
                            {/* <TableCell>Role</TableCell> */}
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            {/* <TableCell>kind</TableCell> */}
                            <TableCell>Balance in Rs</TableCell>
                            <TableCell>status</TableCell>
                            <TableCell>Details</TableCell>
                            <TableCell>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userList && userList.map((item) => {
                            return (
                                <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    {/* <TableCell>{item.role}</TableCell> */}
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>{item.phone}</TableCell>
                                    {/* <TableCell>{item.kind}</TableCell> */}
                                    <TableCell><a href={`/endUser/${item.id}`}>{round(item.wallet.credit, 2)}</a></TableCell>
                                    <TableCell>
                                        <Chip
                                            label={
                                                item.status === "ACTIVE"
                                                    ? "Active"
                                                    : "Deactivated"
                                            }
                                            size="small"
                                            variant="filled"
                                            color={item.status === "ACTIVE" ? "success" : "error"}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpen(item)}>
                                            <InfoIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <DeleteForeverOutlinedIcon color="error" onClick={() => { setSelectedRow(item); handleClickOpen() }} />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Box>
            {userList === undefined && (
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
                        No Users found
                    </div>
                </Card>
            )}
            <Card sx={{ display: "flex", justifyContent: "flex-end" }}>
                <CardContent>
                    <span style={{ padding: "4px" }}> Page : </span>
                    <Pagination
                        count={get(data, "Users.pagination.totalPages", 1)}
                        showFirstButton={get(
                            data,
                            "Users.pagination.hasPrevPage",
                            false
                        )}
                        showLastButton={get(
                            data,
                            "Users.pagination.hasNextPage",
                            false
                        )}
                        onChange={(e, page) => {
                            handlePagination(page);
                        }}
                    />
                </CardContent>
            </Card>
            <Dialog
                open={open}
                onClose={handleClickClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"You want to delete User?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Once you delete the user , before 30 days you can restore user or else 
                        user will be deleted permanently. 
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickClose}>Disagree</Button>
                    <Button onClick={()=>{callDeleteUser();handleClickClose()}} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>

            <QueryTable
                open={openQueryTable}
                handleClose={handleClose}
                queryObject={selectedUser && selectedUser}
                getUserName={selectedUser && selectedUser.name}
                getQueryValue={getKeyValue}
            />
        </React.Fragment>
    );
};

export default UserList;
