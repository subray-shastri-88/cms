import React, { useState, useEffect } from 'react';
import { Card } from '@mui/material';
import { Rings } from 'react-loader-spinner';

const Ring = () => {
  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        position: 'fixed',
        background: 'rgba(0,0,0, 0.5)',
        zIndex: '100000',
        top: '0',
        left: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Rings height="50" width="50" color="white" ariaLabel="loading" />
    </Card>
  );
};

export default Ring;
