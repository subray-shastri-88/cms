import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import ElectricMeterIcon from '@mui/icons-material/ElectricMeter';

export const TotalProfit = (props) => (
  <Card {...props}>
    <CardContent>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            TOTAL UNITS CONSUMED IN kW
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            {props.units}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              height: 56,
              width: 56
            }}
          >
            <ElectricMeterIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
