import * as React from 'react';
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { AppBar, Avatar, Badge, Box, IconButton, Toolbar, Tooltip, Popover, Typography, Card, CardMedia, CardContent, CardActions, Button, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Bell as BellIcon } from "../icons/bell";
import { UserCircle as UserCircleIcon } from "../icons/user-circle";
import { Users as UsersIcon } from "../icons/users";
import { clearAllData } from '../utils/jsUtils';
import LogoutIcon from '@mui/icons-material/Logout';

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#121828',
  boxShadow: theme.shadows[3],
}));

export const DashboardNavbar = (props) => {
  const { onSidebarOpen, ...other } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [name, setName] = React.useState();
  const [kind, setKind] = React.useState();
  const [role, setRole] = React.useState();
  const [phone, setPhone] = React.useState();
  const [email, setEmail] = React.useState();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(()=>{
    const name = sessionStorage.getItem('name');
    const kind = sessionStorage.getItem('kind');
    const role = sessionStorage.getItem('role');
    const phone = sessionStorage.getItem('phone');
    const email = sessionStorage.getItem('email');
    setName(name);
    setKind(kind);
    setRole(role);
    setPhone(phone);
    setEmail(email);
  },[])

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280,
          },
          width: {
            lg: "calc(100% - 280px)",
          },
          // mb: 10
        }}
        {...other}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: "inline-flex",
                lg: "none",
              },
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Notifications">
            <IconButton sx={{ ml: 1, mr: 5 }}>
              <Badge badgeContent={4} color="primary" variant="dot">
                <BellIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
          <Button onClick={handleClick}>
          <Avatar
            sx={{
              height: 40,
              width: 40,
              ml: 1
            }}
            src="/static/images/avatars/avatar_12.png"
            onClick={handleClick}
          >
            <UserCircleIcon fontSize="small" />
          </Avatar>
          </Button>
          
          <div>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <div>
                <Card sx={{ maxWidth: 700, minWidth: 350 }}>
                  <CardMedia
                    sx={{ height: 140, backgroundColor: 'beige', borderColor: 'beige' }}
                  />
                  <CardContent>
                    <Avatar
                      sx={{
                        height: 100,
                        width: 100,
                        position: 'absolute',
                        top: '16%',
                        left: '35%',
                      }}
                      src="/static/images/avatars/avatar_12.png"
                    >
                      <UserCircleIcon fontSize="small" />
                    </Avatar>
                    <Box sx={{ mt: 3, mb: 3, alignContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                      <Typography component="div" sx={{ fontSize: '18px', fontWeight: '600' }}>
                        {name}
                      </Typography>
                      <Typography component="div" sx={{ fontSize: '14px', fontWeight: '500' }}>
                        {kind}  {role} 
                      </Typography>
                      <Typography component="div" sx={{ fontSize: '14px', fontWeight: '400' }} color='primary'>
                        {phone}
                      </Typography>
                      <Typography component="div" sx={{ fontSize: '14px', fontWeight: '400' }} color='primary'>
                        {email}
                      </Typography>
                    </Box>
                    <Divider></Divider>
                    <Box sx={{ mt: 1, mb: 1 }}>
                      <Box>
                        <Button size="small" variant='secondary'>Terms and Conditions</Button>
                      </Box>
                      <Box>
                        <Button size="small" variant='secondary'>Help</Button>
                      </Box>
                      <Box>
                        <Button size="small" variant='secondary'>FAQ</Button>
                      </Box>
                    </Box>
                    <Divider></Divider>
                    <Box sx={{ mt: 2 }}>
                      <Box>
                        <Button size="small" startIcon={<LogoutIcon />}
                          onClick={() => clearAllData()}>Logout</Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </div>
            </Popover>
          </div>
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func,
};
