import React, { useState, useEffect } from "react";
import QrCodeScanner from "../components/QrCodeScanner";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Close, Money, Paid, People } from "@mui/icons-material";
import TotalGraph from "../components/TotalGraph";
import axiosClient from "../axios-client";
import AppointmentsToday from "./AppointmentsToday";
import { HomeSearchBar } from "../components/HomeSearchBar";

export default function Home() {
  const [petowners, setPetowners] = useState([]);
  const [pets, setPets] = useState([]);
  const [income, setIncome] = useState([]);
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

  const getDailyIncome = () => {
    axiosClient
      .get(`/paymentrecords/daily`)
      .then(({ data }) => {
        setIncome(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(0);
        }
      });
  };

  const [openscan, setOpenscan] = useState(false);

  const openQR = () => {
    setOpenscan(true);
    location.reload();
  };

  const closeQR = () => {
    setOpenscan(false);
    location.reload();
  };

  useEffect(() => {
    getPetownersTotal();
    getPetsTotal();
    getDailyIncome()
  }, []);

  return (
    <>
      <Paper sx={{ padding: "15px", margin: "10px", height: "100%" }}>
        <Typography variant="h5" mb={1}>
          Home
        </Typography>
        <Stack flexDirection={"row"}>
          <Stack
            flexDirection={"column"}
            sx={{ width: "710px", height: "100px", alignItems: "center" }}
          >
            <Stack flexDirection={"row"}>
              <TotalGraph
                total={pets}
                totaltype="Pets"
                color={"#1769aa"}
                link={"/admin/pets"}
                width="200px"
              />
              <TotalGraph
                total={petowners}
                totaltype="Petowners"
                color={"#357a38"}
                icon={People}
                link={"/admin/petowners"}
                width="200px"

              />
               <TotalGraph
                total={parseFloat(income)}
                totaltype="Daily Income"
                color={"#ffc107"}
                icon={Paid}
                link={"/admin/paymentrecords"}
                width="250px"
              />
            </Stack>
            <Stack width={"710px"}>
              <AppointmentsToday />
            </Stack>
          </Stack>
          <Stack flexDirection={"column"} height={"480px"}>
            <HomeSearchBar />
            <Box
              sx={{
                mt: 4,
                width: "300px",
                height: "300px",
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
                  {/* <Button
                  onClick={closeQR}
                  variant="contained"
                  sx={{ mt: 1 }}
                >
                  close
                </Button> */}
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
        </Stack>
      </Paper>
    </>
  );
}
