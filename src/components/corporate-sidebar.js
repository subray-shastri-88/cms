import { useEffect } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Typography,
  useMediaQuery,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { ChartBar as ChartBarIcon } from "../icons/chart-bar";
import { Cog as CogIcon } from "../icons/cog";
import { Lock as LockIcon } from "../icons/lock";
import { Selector as SelectorIcon } from "../icons/selector";
import { ShoppingBag as ShoppingBagIcon } from "../icons/shopping-bag";
import { User as UserIcon } from "../icons/user";
import { UserAdd as UserAddIcon } from "../icons/user-add";
import { Users as UsersIcon } from "../icons/users";
import { XCircle as XCircleIcon } from "../icons/x-circle";
import logo from "../icons/logowhite.svg";
import Image from "next/image";
import { NavItem } from "./nav-item";
import ElectricCarIcon from "@mui/icons-material/ElectricCar";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EvStationIcon from "@mui/icons-material/EvStation";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import GroupIcon from "@mui/icons-material/Group";
import { clearAllData } from "../utils/jsUtils";
import LogoutIcon from "@mui/icons-material/Logout";

export const CorporateSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const { id: partnerId } = router.query;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("mds"), {
    defaultMatches: true,
    noSsr: false,
  });

  const items = [
    {
      href: `/corporate-partner/${partnerId}`,
      icon: <ChartBarIcon fontSize="small" />,
      title: "Dashboard",
    },
    {
      href: `/corporate-partner/${partnerId}/fleet`,
      icon: <ElectricCarIcon fontSize="small" />,
      title: "Fleet Management",
    },
    {
      href: `/corporate-partner/${partnerId}/admins`,
      icon: <UsersIcon fontSize="small" />,
      title: "User Management",
    },
    {
      href: `/corporate-partner/${partnerId}/rfid`,
      icon: <CreditCardIcon fontSize="small" />,
      title: "RFID Management",
    },
  ];

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
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div>
          <Box sx={{ p: 3 }}>
            <NextLink href={`/corporate-partner/${partnerId}`} passHref>
              <>
                <a>
                  <Image src={logo} alt="QuikPlugs" width={170} />
                </a>
                <p
                  style={{
                    float: "right",
                    marginRight: "60px",
                    marginBottom: "30px",
                    marginTop: "-20px",
                    fontWeight: "bold",
                  }}
                >
                  For Corporate
                </p>
              </>
            </NextLink>
          </Box>
        </div>
        {/* <Divider
          sx={{
            borderColor: '#2D3748',
            my: 3
          }}
        /> */}
        <Box sx={{ flexGrow: 1 }}>
          {items.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
              isMenu={item.isMenu}
            />
          ))}
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
            backgroundColor: "neutral.900",
            color: "#FFFFFF",
            width: 280,
          },
        }}
        variant="permanent"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          {content}
          {/* <div>
            <Button
              sx={{ color: "#fff", width: "100%" }}
              onClick={() => clearAllData()}
              startIcon={<LogoutIcon />}
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
          backgroundColor: "neutral.900",
          color: "#FFFFFF",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        {content}
        {/* <div>
          <Button
            sx={{ color: "#fff", width: "100%" }}
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

CorporateSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
