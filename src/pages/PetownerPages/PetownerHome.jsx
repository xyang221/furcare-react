import React, { useState, useEffect } from "react";
import QrCodeScanner from "../../components/QrCodeScanner";
import {
  Box,
  Button,
  Grid,
  IconButton,
  List,
  Menu,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Add, Close, Money, Paid, People } from "@mui/icons-material";
import TotalGraph from "../../components/TotalGraph";
import axiosClient from "../../axios-client";
import AppointmentsToday from "../AppointmentsToday";
import { HomeSearchBar } from "../../components/HomeSearchBar";
import { useStateContext } from "../../contexts/ContextProvider";
import PO_AppointmentsToday from "./PO_AppointmentsToday";
import PO_VaccinationReturn from "./PO_VaccinationReturn";
import pusher from "../../echo";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import echo from "../../echo";

export default function PetownerHome() {
  const [pets, setPets] = useState([]);
  const [balance, setBalance] = useState([]);
  const [message, setMessage] = useState("");

  const { staffuser, user } = useStateContext();

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
          setBalance(response.data.message);
        }
      });
  };

  // const pushAppointment = () => {
  //   const channel = pusher.subscribe("admin-channel");
  //   channel.bind("appointment-event", function (data) {
  //     alert(data.data);
  //   });
  // }

  const channel = echo.private(`admin-channel.${3}`);
  // const channel = echo.channel(`admin-channel`);

  channel.listen(".appointment-event", function (data) {
    const display = `The appointment ${data.id} of ${data.firstname} ${data.lastname} is on ${data.date}`;
    toast.info(display, { theme: "colored",autoClose:10000 });
  });
  console.log(channel)
  // useEffect(() => {
  //   if (channel) {
  //     // Run this block every 5 seconds (adjust the interval as needed)
  //     // const intervalId = setInterval(() => {
  //     // axiosClient
  //     //   .get("/appointments-triger/today")
  //     //   .then((response) => {
  //     //     console.log("Initial Data Received:", response.data);
  //     //   })
  //     //   .catch((error) => {
  //     //     console.error("Error fetching initial data:", error);
  //     //   });
  //     // channel.bind("appointment-event", function (data) {
  //     //   const display = `The appointment ${data.id} of ${data.firstname} ${data.lastname} is today ${data.date}`
  //     //   toast.info(display, { theme: "colored" });
  //     // });
  //     channel.listen(".appointment-event", function (data) {
  //       const display = `The appointment ${data.id} of ${data.firstname} ${data.lastname} is today ${data.date}`
  //       toast.info(display, { theme: "colored" });
  //     });
  //     // channel.bind('appointment-event', function(data) {
  //     //   toast.info(data, { theme: "colored" });
  //     // });

  //     // Log a test message
  //     console.log(channel);
  //     // }, 60000); // 10000 milliseconds = 10 seconds

  //     // Clear the interval when the component is unmounted
  //     // return () => clearInterval(intervalId);
  //   }
  // }, [channel]);

  useEffect(() => {
    getPetsTotal();
    // pushAppointment()
    getBalance();
  }, []);

  return (
    <>
      <Paper sx={{ padding: "15px", margin: "10px", height: "100%" }}>
        <Typography variant="h5" mb={1}>
          Home
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TotalGraph
              total={pets}
              totaltype="Pets"
              color={"#1769aa"}
              link={"/petowner/pets"}
              width="100%"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TotalGraph
              total={balance}
              totaltype="Pending Balance"
              color={"#ffc107"}
              icon={Paid}
              width="100%"
            />
          </Grid>
          <Grid item xs={12} md={4}>
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
          </Grid>
          <Grid item xs={12} md={6}>
            <PO_AppointmentsToday />
          </Grid>
          <Grid item xs={12} sm={5} md={6}>
            <PO_VaccinationReturn />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
