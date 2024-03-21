import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography
} from '@mui/material';
import InsertChartIcon from '@mui/icons-material/InsertChartOutlined';
import EvStationIcon from '@mui/icons-material/EvStation';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import GroupIcon from '@mui/icons-material/Group';

export const CPOCOUNT = (props) => (
  <Card sx={{ height: '100%' }} {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="overline">
            CPO
          </Typography>
          <Typography color="textPrimary" variant="h4">
            {props.cpo}
          </Typography>
        </Grid>
      </Grid>
      <Box
        sx={{
          pt: 2,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Typography color="textSecondary" variant="caption">
          No of Operator Partners
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export const ISOCOUNT = (props) => (
  <Card sx={{ height: '100%' }} {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="overline">
            ISO
          </Typography>
          <Typography color="textPrimary" variant="h4">
            {props.iso}
          </Typography>
        </Grid>
      </Grid>
      <Box
        sx={{
          pt: 2,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Typography color="textSecondary" variant="caption">
          No of Station Owners
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export const CORPCOUNT = (props) => (
  <Card sx={{ height: '100%' }} {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="overline">
            CORPORATES
          </Typography>
          <Typography color="textPrimary" variant="h4">
            {props.corp}
          </Typography>
        </Grid>
      </Grid>
      <Box
        sx={{
          pt: 2,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Typography color="textSecondary" variant="caption">
          No of Corporate Partners
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export const FLEETDRIVERS = (props) => (
  <Card sx={{ height: '100%' }} {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="overline">
            Fleet Drivers
          </Typography>
          <Typography color="textPrimary" variant="h4">
            {props.drivers}
          </Typography>
        </Grid>
      </Grid>
      <Box
        sx={{
          pt: 2,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Typography color="textSecondary" variant="caption">
          No of Corporate Drivers
        </Typography>
      </Box>
    </CardContent>
  </Card>
);
