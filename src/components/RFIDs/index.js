import React, { useEffect } from 'react';
import { useRouter } from "next/router";
import { get } from 'lodash';
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
  Chip
} from '@mui/material';
import Ring from '../ui/Loader/Ring';
import Pagination from '@mui/material/Pagination';
import AssignRfidToCorporate from './rfidToCorporate';
import AssignRfidToUser from './rfidToUser';
import { ToggleRFIDTagSuspension } from 'src/graphQL/rfid';
import { useMutation } from "@apollo/client";

const RFIDs = ({ rfidTags, pagination, loading, handledPagination , refetch}) => {
  const router = useRouter();
  const { id: name } = router.query;

  const [handleToggleRfidStatus, { data: toggleData }] = useMutation(
    ToggleRFIDTagSuspension,
    {
      variables: {
        id: null,
        isSuspended: null,
      },
    }
  );

  const toggleRfid = (id , isSuspended) => {
    const fields = {
      id: id,
      isSuspended: isSuspended
    };
    handleToggleRfidStatus({
      variables: fields,
    });
  };

  const refetchCorp =()=>{
    refetch();
  }

  // useEffect(()=>{
  //   if(rfidTags){
  //      refetch();
  //   }
  // },[rfidTags])

  useEffect(()=>{
    if(toggleData){
      refetch();
    }
  }, [toggleData])

  console.log(pagination , 'page');
  console.log(name , 'name');

  return (
    <React.Fragment>
      {loading && <Ring />}
      <Box>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell align="left">RFID</TableCell>
              <TableCell align="left">CPO</TableCell>
              <TableCell align="left">Corporate</TableCell>
              <TableCell align="left">User</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rfidTags.map((item) => {
              console.log(item)
              return (
                <TableRow key={item.id}>
                  <TableCell align="left">{item.idTag}</TableCell>
                  <TableCell align="left">
                    {get(item, 'cpo.name', '--')}
                  </TableCell>
                  <TableCell align="left">
                    {get(item, 'corporate.name') ? (
                      get(item, 'corporate.name', '')
                    ) : (
                      <AssignRfidToCorporate
                        loadData={handledPagination}
                        rfId={item.id}
                        refetchCorp={refetchCorp}
                      />
                    )}
                  </TableCell>
                  <TableCell align="left">
                    {
                      (!name && name === undefined) || get(item, 'user.name') ?
                      get(item, 'user.name', '--')
                      :(<AssignRfidToUser
                        loadData={handledPagination}
                        rfId={item.id}
                        refetchRfid={refetchCorp}
                      />) 
                    }
                    
                  </TableCell>
                  <TableCell align="left">
                    <Chip
                      label={(item.suspended) === false ? 'Active' : 'Suspended'}
                      size="small"
                      variant="filled"
                      color={
                        (item.suspended) === false ? 'success' : 'warning'
                      }
                    />
                  </TableCell>
                  <TableCell align="left">
                    <ButtonGroup
                      size="small"
                      aria-label="small button group"
                      variant="text"
                    >
                      {!(item.suspended === false) ? (
                        <Button
                          key="one"
                          color="success"
                          sx={{ width: "92px" }}
                          onClick={() => toggleRfid(item.id, false)}
                        >
                          Activate
                        </Button>
                      ) : (
                        <Button
                          key="one"
                          color="error"
                          sx={{ width: "92px" }}
                          onClick={() => toggleRfid(item.id, true)}
                        >
                          Suspend
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
          sx={{ float: 'right', display: 'flex', flexDirection: 'row' }}
        >
          <span style={{ padding: '4px' }}> Page : </span>
          <Pagination
            count={get(pagination, 'totalPages', 1)}
            page={get(pagination, 'page', 1)}
            showFirstButton={get(pagination, 'hasPrevPage', false)}
            showLastButton={get(pagination, 'hasNextPage', false)}
            onChange={(e, page) => {
              handledPagination(page);
            }}
          />
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

RFIDs.defaultProps = {};

RFIDs.propTypes = {};

export default RFIDs;
