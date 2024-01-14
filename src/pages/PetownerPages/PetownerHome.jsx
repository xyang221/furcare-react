import React, { useState, useEffect } from "react";
import QrCodeScanner from "../../components/QrCodeScanner";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Close, Money, Paid, People } from "@mui/icons-material";
import TotalGraph from "../../components/TotalGraph";
import axiosClient from "../../axios-client";
import AppointmentsToday from "../AppointmentsToday";
import { HomeSearchBar } from "../../components/HomeSearchBar";
import { useStateContext } from "../../contexts/ContextProvider";

export default function PetownerHome() {
  const [pets, setPets] = useState([]);
  const [message, setMessage] = useState("");

  const {staff}=useStateContext();

  const getPetsTotal = () => {
    axiosClient
      .get(`/petowners/${staff.id}/countpets`)
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
    getPetsTotal();
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
                link={"/petowner/pets"}
                width="200px"
              />
            </Stack>
            <Stack width={"710px"}>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </>
  );
}
