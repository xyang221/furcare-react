import React from 'react';
import { Box, Button } from '@mui/material';

function QrCodeGenerator(props) {
  const { GenerateQRCode, qr, petname } = props;

  return (
    <div>
      {qr ? (
        <Box sx={{ width: '50px' }}>
          <img src={qr} alt="QR Code" />
          <Button variant="contained" href={qr} download={`${petname}-qrcode.png`}>
            Download
          </Button>
        </Box>
      ) : (
        <Button variant="contained" onClick={GenerateQRCode}>
          Generate QR
        </Button>
      )}
    </div>
  );
}

export default QrCodeGenerator;
