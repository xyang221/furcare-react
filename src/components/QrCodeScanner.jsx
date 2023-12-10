import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QrCodeScanner() {
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 5,
      qrbox: 250,
    });

    function success(result) {
      scanner.clear();
      navigate(`/admin/pets/${result}/view`);
    }

    function error(err) {
      console.warn(err);
    }

    scanner.render(success, error);

    return () => {
      scanner.clear();
    };
  }, [navigate]);


  return (
    <div className="app">
      <h1>QR Scanner</h1>
      <div id="reader" style={{ width: "250px", height: "250px" }}></div>
     </div>
  );
}

