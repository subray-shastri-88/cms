import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Document, Page } from 'react-pdf';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import Typography from '@mui/material/Typography';

const generateQRCode = (string) => {
  return (
    <QRCodeCanvas
      id={string}
      bgColor="#fff"
      value={string}
      includeMargin
      marginSize={5}
      size={500}
      imageSettings={{
        height: 110,
        width: 110
      }}
    />
  );
};

const QRCodePDF = ({ string }) => {
  const canvas = useRef();
  const qrCode = generateQRCode(string);

  const download = () => {
    let canvas1 = document.getElementById(string);
    let url = canvas1.toDataURL('image/png');
    let link = document.createElement('a');
    link.download = `${string}.png`;
    link.href = url;
    link.click();
  };

  return (
    <div
      style={{
        width: '600px',
        padding: '50px',
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        background: '#fff',
        margin: '10% auto'
      }}
    >
      <div>{qrCode}</div>
      <div>
        <Typography variant="h4"> Download QR Code Here</Typography>
      </div>
      <div>
        <IconButton
          size="large"
          aria-label="download"
          color="secondary"
          onClick={download}
        >
          <DownloadIcon sx={{ width: 50, height: 50 }} />
        </IconButton>
      </div>
      <div>
        <Typography variant="h6"> {`${string}.png`}</Typography>
      </div>
    </div>
  );
};

export default QRCodePDF;
