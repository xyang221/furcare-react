import React, { useState, useEffect } from "react";
import QrCodeScanner from "../../components/QrCodeScanner";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Close, Money, Paid, People } from "@mui/icons-material";
import TotalGraph from "../../components/TotalGraph";
import axiosClient from "../../axios-client";
import AppointmentsToday from "../AppointmentsToday";
import { HomeSearchBar } from "../../components/HomeSearchBar";
import { useStateContext } from "../../contexts/ContextProvider";
import PO_AppointmentsToday from "./PO_AppointmentsToday";
import PO_VaccinationReturn from "./PO_VaccinationReturn";

export default function PetownerHome() {
  const [pets, setPets] = useState([]);
  const [balance, setBalance] = useState([]);
  const [message, setMessage] = useState("");

  const { staffuser } = useStateContext();

  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = (query) => {
    setMessage(null);
    if (query) {
      setMessage(null);
      setData([]);
      setLoading(true);
      axiosClient
        .get(`/petowner/${staffuser.id}/pets-search/${query}`)
        .then(({ data }) => {
          setLoading(false);
          setData(data.data);
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 404) {
            setMessage(response.data.message);
          }
          setLoading(false);
        });
    }
  };

  const getPetsTotal = () => {
    setMessage(null);
    axiosClient
      .get(`/petowners/${staffuser.id}/countpets`)
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

  const getBalance = () => {
    setMessage(null);
    axiosClient
      .get(`/clientdeposits/${staffuser.id}/balance`)
      .then(({ data }) => {
        setBalance(data.balance.toFixed(2));
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
    getBalance();
  }, []);

  return (
    <>
      <Paper sx={{ padding: "15px", margin: "10px", height: "100%" }}>
        <Typography variant="h5" mb={1}>
          Home
        </Typography>
        <Stack flexDirection={"column"}>
          <Stack
            flexDirection={"row"}
            sx={{ width: "1050px", height: "100px", alignItems: "center" }}
          >
            <Stack flexDirection={"row"}>
              <TotalGraph
                total={pets}
                totaltype="Pets"
                color={"#1769aa"}
                link={"/petowner/pets"}
                width="340px"
              />
              <TotalGraph
                total={balance}
                totaltype="Pending Balance"
                color={"#ffc107"}
                icon={Paid}
                width="340px"
              />
            </Stack>
            <Stack mt={-2}>
            <HomeSearchBar
              searchwhat={"pets"}
              placeholder={"Search pets here..."}
              navigatetype={"/petowner/pets"}
              query={query}
              setQuery={setQuery}
              data={data}
              setData={setData}
              message={message}
              setMessage={setMessage}
              loading={loading}
              setLoading={setLoading}
              search={search}
            />
           </Stack>
          </Stack>
          <Stack flexDirection={"row"}>
              <Stack width={"525px"}>
                <PO_AppointmentsToday />
              </Stack>
              <Stack width={"525px"}>
                <PO_VaccinationReturn />
              </Stack>
          </Stack>
        </Stack>
      </Paper>
    </>
  );
}
