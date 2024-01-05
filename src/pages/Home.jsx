import React, { useState, useEffect } from "react";
import QrCodeScanner from "../components/QrCodeScanner";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import CryptoJS from "crypto-js";
import { Close, People } from "@mui/icons-material";
import TotalGraph from "../components/TotalGraph";
import axiosClient from "../axios-client";
import Appointments from "./Appointments";

export default function Home() {
  const [petowners, setPetowners] = useState([]);
  const [pets, setPets] = useState([]);
  const [message, setMessage] = useState("");

  const getPetownersTotal = () => {
    axiosClient
      .get(`/petowners-count`)
      .then(({ data }) => {
        setPetowners(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
      });
  };

  const getPetsTotal = () => {
    axiosClient
      .get(`/pets-count`)
      .then(({ data }) => {
        setPets(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
      });
  };

  const [openscan, setOpenscan] = useState(false);

  useEffect(() => {
    getPetownersTotal();
    getPetsTotal();
  }, []);

  return (
    <>
      <Paper sx={{ padding: "15px", margin: "10px", height: "100%" }}>
        <Typography variant="h5" mb={1}>
          Home
        </Typography>
        <Stack
          flexDirection={"row"}
          sx={{ width: "500px", height: "150px" }}
        >
          <TotalGraph
            total={pets}
            totaltype="Pets"
            color={"#1769aa"}
            link={"/admin/pets"}
          />
          <TotalGraph
            total={petowners}
            totaltype="Petowners"
            color={"#357a38"}
            icon={People}
            link={"/admin/petowners"}
          />
        </Stack>
        <Stack flexDirection={"row"}>
          <Stack width={"650px"}>
            <Appointments />
          </Stack>
          <Box
            sx={{
              width: "350px",
              height: "350px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "1px black solid",
            }}
          >
            {openscan ? (
              <>
                <QrCodeScanner />
                <Button
                  onClick={() => setOpenscan(false)}
                  variant="contained"
                  sx={{ mt: 1 }}
                >
                  close
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setOpenscan(true)} variant="contained">
                  scan qr code
                </Button>
              </>
            )}
          </Box>
        </Stack>
      </Paper>
    </>
  );
}
