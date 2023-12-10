import React, { useState, useEffect } from "react";
import QrCodeScanner from "../components/QrCodeScanner";

export default function Home() {

  // if (token) {
  //     return <Navigate to="/" />;
  // }

  return (
    <>
    <QrCodeScanner/>
    </>
  )
}
