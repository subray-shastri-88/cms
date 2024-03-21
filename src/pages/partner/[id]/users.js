import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  CardHeader,
  Typography,
} from "@mui/material";
import { DashboardLayout } from "../../../components/dashboard-layout";
import UserList from "../../../components/operators/Users";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Users from "../../../components/users";
import compose from '../../../utils/compose';
import { auth } from '../../../utils/ssrUtils';

const BookingList = (props) => {
  const router = useRouter();
  const { id: name } = router.query;
  const [station, setStation] = useState("");
  const [date, setDate] = useState("");
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 3,
        "@media (max-width: 600px)": { 
          padding: "1rem",
        },
        "@media (min-width: 601px) and (max-width: 1024px)": { 
          padding: "2rem",
        },
      }}
    >
      <Container maxWidth="xl">
        <Card>
          <Typography sx={{ m: 3 }} variant="h4">
            User Management
          </Typography>
        </Card>
        <Grid container spacing={3}>
          <Grid item md={12} xs={12}>
            <Box sx={{ marginTop: 2, borderBottom: 1, borderColor: "divider" }}>
              <Card>
                <Users kind={"CPO"} resourceId={name} />
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

BookingList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default BookingList;

export const getServerSideProps = compose(auth);