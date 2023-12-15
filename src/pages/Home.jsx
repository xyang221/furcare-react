import React, { useState, useEffect } from "react";
import QrCodeScanner from "../components/QrCodeScanner";
import { Button } from "@mui/material";

export default function Home() {

  const [openscan, setOpenscan] = useState(false);

  return (
    <>
      <Button onClick={(e) => setOpenscan(true)}>scan</Button>
      {openscan ? <QrCodeScanner /> : null}
    </>
  );
}
