import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

export default function ClientService() {
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);

  const [services, setServices] = useState([]);

  const getServices = () => {
    setModalloading(true);
    axiosClient
      .get(`/services`)
      .then(({ data }) => {
        setModalloading(false);
        setServices(data.data);
      })
      .catch(() => {
        setModalloading(false);
      });
  };

  const [petowners, setPetowners] = useState([]);

  const getPetowners = () => {
    setModalloading(true);
    axiosClient
      .get(`/petowners`)
      .then(({ data }) => {
        setModalloading(false);
        setPetowners(data.data);
      })
      .catch(() => {
        setModalloading(false);
      });
  };

  //for modal
  const [errors, setErrors] = useState(null);
  const [value, newValue] = useState(null);
  const [modalloading, setModalloading] = useState(false);
  const [clientservice, setClientService] = useState({
    id: null,
    deposit: "",
    balance: "",
    rendered_by: "",
    petowner_id: null,
    services_id: null,
  });
  const [open, openchange] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const addModal = (ev) => {
    getPetowners();
    setOpenAdd(true);
    setClientService({});
    setErrors(null);
  };

  const closepopup = () => {
    openchange(false);
    setOpenAdd(false);
  };

  const onEdit = (r) => {
    setErrors(null);
    setModalloading(true);
    axiosClient
      .get(`/appointments/${r.id}`)
      .then(({ data }) => {
        setModalloading(false);
        setClientService(data);
      })
      .catch(() => {
        setModalloading(false);
      });
    openchange(true);
  };

  const onSubmit = () => {
    if (clientservice.id) {
      axiosClient
        .put(`/clientservices/${clientservice.id}`, clientservice)
        .then(() => {
          setNotification("clientservice was successfully updated");
          openchange(false);
          getPetowners();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/clientservices`, clientservice)
        .then(() => {
          setNotification("clientservice was successfully created");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  const [date, setDate] = useState(new Date());

  useEffect(() => {
    getServices();
    getPetowners();
  }, []);

  return (
    <>
      <Paper
        sx={{
          minWidth: "90%",
          padding: "10px",
          margin: "10px",
        }}
      >
        {notification && <Alert severity="success">{notification}</Alert>}
        <Box
          p={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Typography variant="h4">Consent For Treatment </Typography>
        </Box>

        <Typography variant="h6">Date: {date.toDateString()} </Typography>
        <TextField
          id="Deposit"
          label="Deposit"
          type="number"
          variant="standard"
          value={clientservice.deposit}
          onChange={(ev) =>
            setClientService({ ...clientservice, deposit: parseFloat(ev.target.value) })
          }
        />

        <TextField
          id="Balance"
          label="Balance"
          type="number"
          variant="standard"
          value={clientservice.balance}
          onChange={(ev) =>
            setClientService({ ...clientservice, balance: parseFloat(ev.target.value) })
          }
        />
        <br></br>
        <br></br>
        <Autocomplete
          sx={{ width: "100%" }}
          getOptionLabel={(option) => `${option.firstname} ${option.lastname}`}
          options={petowners}
          isOptionEqualToValue={(option, value) =>
            option.firstname === value.firstname
          }
          noOptionsText="Not Found"
          renderOption={(props, option) => (
            <li {...props}>
              {option.firstname} {option.lastname}
            </li>
          )}
          renderInput={(params) => <TextField {...params} label="Petowner" />}
          value={clientservice.petowner_id}
          onChange={(ev, newValue) => {
            setClientService({
              ...clientservice,
              petowner_id: newValue,
            });
          }}
        />

        <Select
          label="Services"
          value={clientservice.services_id || ""}
          onChange={(ev) =>
            setClientService({ ...clientservice, services_id: ev.target.value })
          }
        >
          {services.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.service}
            </MenuItem>
          ))}
        </Select>

        <Button color="primary" variant="contained" onClick={onSubmit}>
          Save
        </Button>
      </Paper>
    </>
  );
}
