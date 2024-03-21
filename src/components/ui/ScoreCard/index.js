import React from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography
} from '@mui/material';

const ScoreCard = ({ label, count, tagline, color }) => {
  return (
    <Card sx={{ height: '100%', padding: '15px' }}>
      <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="overline">
            {label}
          </Typography>
          <Typography color={color} variant="h2">
            {count}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

ScoreCard.defaultProps = {
  label: 'Count',
  tagline: '',
  count: 0,
  color: 'textPrimary'
};

ScoreCard.propTypes = {
  label: PropTypes.string,
  tagline: PropTypes.string,
  count: PropTypes.number,
  color: PropTypes.string
};

export default ScoreCard;
