import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { get } from "lodash";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ButtonGroup,
  Button,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Delete } from "@mui/icons-material";
import userApis from "../../graphQL/users";
import { useQuery, useMutation } from "@apollo/client";
import Ring from "../ui/Loader/Ring";
import Pagination from "@mui/material/Pagination";

const Users = ({
  kind,
  isAdmins,
  reloader,
  resourceId = "",
  corporates,
  cpos,
}) => {
  const [userList, setUserList] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { getUsers, ToggleUserStatus } = userApis;
  const { loading, error, data, refetch } = useQuery(getUsers, {
    variables: {
      filter: {
        kind: kind,
        resourceId: resourceId,
      },
      pagination: {
        page: 1,
        limit: rowsPerPage,
      },
    },
  });

  const [handleToggleUserStatus, { data: toggleData }] = useMutation(
    ToggleUserStatus,
    {
      variables: {
        userId: null,
        status: null,
      },
    }
  );

  const handledPagination = (page) => {
    refetch({
      filter: {
        kind: kind,
        resourceId: resourceId,
      },
      pagination: {
        page: page,
        limit: rowsPerPage,
      },
    });
  };

  const getPartnerName = (refId) => {
    if (kind === "ADMIN") {
      return "Quikplugs";
    }
    if (!refId) return "--";

    if (kind === "CORP") {
      const match = corporates.find((item) => item.id === refId);
      return get(match, "name", "");
    }

    if (kind === "CPO") {
      const match = cpos.find((item) => item.id === refId);
      return get(match, "name", "");
    }
  };

  useEffect(() => {
    reloader &&
      reloader({
        fetch: () => handledPagination(0),
      });
  }, []);

  useEffect(() => {
    let lists = get(data, "Users.docs", []).filter((item) => item.id);
    setUserList(lists);
  }, [loading, error, data]);

  const toggleUser = (userId, status) => {
    const fields = {
      userId: userId,
      status: status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    };
    handleToggleUserStatus({
      variables: fields,
    });
  };

  useEffect(() => {
    if (toggleData) {
      refetch();
    }
  }, [toggleData]);

  return (
    <React.Fragment>
      {/* {loading && <Ring />} */}
      <Box>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Partner</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {userList.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{get(item, "name", "--")}</TableCell>
                  <TableCell>{get(item, "email", "--")}</TableCell>
                  <TableCell>{get(item, "phone", "--")}</TableCell>
                  <TableCell>{get(item, "role", "--")}</TableCell>
                  {isAdmins && (
                    <TableCell>
                      {getPartnerName(get(item, "resourceId", ""))}
                    </TableCell>
                  )}
                  {!isAdmins && (
                    <TableCell>{get(item, "resourceId", "")}</TableCell>
                  )}
                  <TableCell>
                    <Chip
                      label={
                        get(item, "status") === "ACTIVE"
                          ? "Active"
                          : "Deactivated"
                      }
                      size="small"
                      variant="filled"
                      color={
                        get(item, "status") === "ACTIVE" ? "success" : "error"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <ButtonGroup
                      size="small"
                      aria-label="small button group"
                      variant="text"
                    >
                      {!(get(item, "status") === "ACTIVE") ? (
                        <Button
                          key="one"
                          color="success"
                          sx={{ width: "92px" }}
                          onClick={() => toggleUser(item.id, item.status)}
                        >
                          Activate
                        </Button>
                      ) : (
                        <Button
                          key="one"
                          color="error"
                          sx={{ width: "92px" }}
                          onClick={() => toggleUser(item.id, item.status)}
                        >
                          Deactivate
                        </Button>
                      )}
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Card>
        <CardContent
          sx={{ float: "right", display: "flex", flexDirection: "row" }}
        >
          <span style={{ padding: "4px" }}> Page : </span>
          <Pagination
            count={get(data, "Users.pagination.totalPages", 1)}
            page={get(data, "Users.pagination.page", 1)}
            showFirstButton={get(data, "Users.pagination.hasPrevPage", false)}
            showLastButton={get(data, "Users.pagination.hasNextPage", false)}
            onChange={(e, page) => {
              handledPagination(page);
            }}
          />
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

Users.defaultProps = {
  kind: "",
};

Users.propTypes = {
  kind: PropTypes.string,
};

export default Users;
