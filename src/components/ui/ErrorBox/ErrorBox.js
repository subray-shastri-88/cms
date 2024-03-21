import React, { useState, useEffect } from 'react';

const ErrorBox = ({ message }) => {
  return (
    <div
      style={{
        position: 'sticky',
        right: 0,
        top: 0,
        left: 0,
        width: '100%',
        height: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        background: '#ff0000',
        zIndex: '999',
        fontWeight: '500'
      }}
    >
      {message}
    </div>
  );
};

export default ErrorBox;
