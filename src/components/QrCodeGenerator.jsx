import React, { useState } from "react";
import { Box, Button } from "@mui/material";

function QrCodeGenerator(props) {
  const { GenerateQRCode, qr  } = props;

  return (
    <div className="app" >
      {qr ? (
        <Box sx={{width:"50px"}}>
          <img src={qr} alt="QR Code" />
          <Button variant="contained" href={qr} download="qrcode.png">
            Download
          </Button>
        </Box>
      ):( <Button variant="contained" onClick={GenerateQRCode}>Generate qr</Button>)}
    </div>
  );
}

export default QrCodeGenerator;
