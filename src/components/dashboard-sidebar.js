import { useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Drawer,
  Typography,
  useMediaQuery
} from '@mui/material';
import { ChartBar as ChartBarIcon } from '../icons/chart-bar';
import logo from '../icons/logowhite.svg';
import Image from 'next/image';
import { NavItem } from './nav-item';
import EvStationIcon from '@mui/icons-material/EvStation';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import GroupIcon from '@mui/icons-material/Group';
import BookIcon from '@mui/icons-material/Book';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { clearAllData } from '../utils/jsUtils';
import LogoutIcon from '@mui/icons-material/Logout';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const dashboard = [
  {
    href: '/',
    icon: <ChartBarIcon fontSize="small" />,
    title: 'Analytics'
  },
];

const AdminManagement = [
  {
    href: '/cpo',
    icon: <DeviceHubIcon fontSize="small" />,
    title: 'CPO Management'
  },
  {
    href: '/stationOwners',
    icon: <AdminPanelSettingsIcon fontSize="small" />,
    title: 'ISO Management'
  },
  {
    href: '/corporates',
    icon: <WorkspacesIcon fontSize="small" />,
    title: 'Corporate Partners'
  },
  {
    href: '/users',
    icon: <GroupIcon fontSize="small" />,
    title: 'User Management'
  },
  {
    href: '/endUser',
    icon: <GroupIcon fontSize="small" />,
    title: 'Users'
  }
];

const station = [
  {
    href: '/stations',
    icon: <EvStationIcon fontSize="small" />,
    title: 'Charging Stations',
    isMenu: true
  },
  {
    href: '/bookings',
    icon: <BookIcon fontSize="small" />,
    title: 'Bookings'
  },
];

const master = [
  {
    href: '/rfid',
    icon: <LocalOfferIcon fontSize="small" />,
    title: 'RFIDs'
  },
  {
    href: '/vehicles',
    icon: <ElectricCarIcon fontSize="small" />,
    title: 'Vehicles'
  },
  {
    href: '/machines',
    icon: <EvStationIcon fontSize="small" />,
    title: 'Machines',
    isMenu: true
  },
]

const items = [
  {
    href: '/tariff',
    icon: <AttachMoneyIcon fontSize="small" />,
    title: 'Tariffs',
    isMenu: true
  }
];

const transaction = [
  {
    href: '/transactions',
    icon: <AttachMoneyIcon fontSize="small" />,
    title: 'Transactions',
    isMenu: true
  },
  {
    href: '/chargePointStatus',
    icon: <ElectricalServicesIcon fontSize="small" />,
    title: 'Charge Point Status',
    isMenu: true
  },
  {
    href: '/webSocket',
    icon: <ElectricalServicesIcon fontSize="small" />,
    title: 'SOC',
    isMenu: true
  }

];

const support = [
  {
    href: '/supports',
    icon: <AttachMoneyIcon fontSize="small" />,
    title: 'Service Request',
    isMenu: true
  }
]

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('mds'), {
    defaultMatches: true,
    noSsr: false
  });

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
            <NextLink href="/" passHref>
              <a>
                <Image src={logo} alt="QuikPlugs" width={170} />
              </a>
            </NextLink>
          </Box>
        </div>
        <Box sx={{ flexGrow: 1 }}>
          <Accordion sx={{backgroundColor:'#121828', color:'white'}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Dashboard</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {dashboard.map((item) => (
                <NavItem
                  key={item.title}
                  icon={item.icon}
                  href={item.href}
                  title={item.title}
                  isMenu={item.isMenu}
                />
              ))}
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{backgroundColor:'#121828', color:'white'}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Admin Management</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {AdminManagement.map((item) => (
                <NavItem
                  key={item.title}
                  icon={item.icon}
                  href={item.href}
                  title={item.title}
                  isMenu={item.isMenu}
                />
              ))}
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{backgroundColor:'#121828', color:'white'}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Station Management</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {station.map((item) => (
                <NavItem
                  key={item.title}
                  icon={item.icon}
                  href={item.href}
                  title={item.title}
                  isMenu={item.isMenu}
                />
              ))}
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{backgroundColor:'#121828', color:'white'}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Master</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {master.map((item) => (
                <NavItem
                  key={item.title}
                  icon={item.icon}
                  href={item.href}
                  title={item.title}
                  isMenu={item.isMenu}
                />
              ))}
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{backgroundColor:'#121828', color:'white'}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Tariff Management</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {items.map((item) => (
                <NavItem
                  key={item.title}
                  icon={item.icon}
                  href={item.href}
                  title={item.title}
                  isMenu={item.isMenu}
                />
              ))}
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{backgroundColor:'#121828', color:'white'}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>OCPP Management</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {transaction.map((item) => (
                <NavItem
                  key={item.title}
                  icon={item.icon}
                  href={item.href}
                  title={item.title}
                  isMenu={item.isMenu}
                />
              ))}
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{backgroundColor:'#121828', color:'white'}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Support</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {support.map((item) => (
                <NavItem
                  key={item.title}
                  icon={item.icon}
                  href={item.href}
                  title={item.title}
                  isMenu={item.isMenu}
                />
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%'
          }}
        >
          {content}
          {/* <div>
            <Button
              startIcon={<LogoutIcon />}
              sx={{ color: '#fff', width: '100%' }}
              onClick={() => clearAllData()}
            >
              Log Out
            </Button>
          </div> */}
        </div>
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%'
        }}
      >
        {content}
        {/* <div>
          <Button
            sx={{ color: '#fff', width: '100%' }}
            startIcon={<LogoutIcon />}
            onClick={() => clearAllData()}
          >
            Log Out
          </Button>
        </div> */}
      </div>
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
