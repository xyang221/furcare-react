import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function TreatmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();

  const [treatment, setTreatment] = useState({
    id: null,
    diagnosis: "",
    body_weight: "",
    heart_rate: "",
    mucous_membrane: "",
    pr_prealbumin: "",
    temp: "",
    respiration_rate: "",
    caspillar_refill_time: "",
    body_condition_Score: "",
    fluid_rate: "",
    comments: "",
  });

  const [petowner, setPetowner] = useState([]);

  const getPetowner = () => {
    setLoading(true);
    axiosClient
      .get(`/petowners/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setPetowner(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const [pets, setPets] = useState([]);
  const getPetownerPets = () => {
    // setLoading(true);
    axiosClient
      .get(`/petowners/${id}/pets`)
      .then(({ data }) => {
        // setLoading(false);
        setPets(data.data);
      })
      .catch(() => {
        // setLoading(false);
      });
  };

  const getPetowners = () => {
    setLoading(true);
    axiosClient
      .get("/treatments")
      .then(({ data }) => {
        setLoading(false);
        setTreatment(data.data);
      })
      .catch(() => {
        setLoading(false);
      });

    // axiosClient
    //   .get("/petowners")
    //   .then(({ data }) => {
    //     setLoading(false);
    //     setPetowners(data.data);
    //   })
    //   .catch(() => {
    //     setLoading(false);
    //   });
  };

  useEffect(() => {
    getPetowner();
    getPetownerPets();
    // getPetowners();
  }, []);

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (treatment.id) {
      axiosClient
        .put(`/treatments/${treatment.id}`, treatment)
        .then(() => {
          setNotification("treatment successfully updated");
          navigate("/treatments");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/treatments/petowner/${id}`, treatment)
        .then(() => {
          setNotification("treatment successfully created");
          navigate(`/admin/services/petowner/${id}/avail/admission`);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  const [date, setDate] = useState(new Date());

  const handleFieldChange = (fieldName, value) => {
    // Create a copy of the breed object and update the specified field
    const updatedDiagnosis = { ...treatment, [fieldName]: value };
    // Update the breed object with the updated value
    setTreatment(updatedDiagnosis);
  };

  return (
    <Paper
      sx={{
        padding: "10px",
      }}
    >
      <h1 className="title">Treatment Sheet</h1>
      {loading && <div className="text-center">Loading...</div>}
      {errors && (
        <div className="alert">
          {Object.keys(errors).map((key) => (
            <p key={key}>{errors[key][0]}</p>
          ))}
        </div>
      )}
      {!loading && (
        <form onSubmit={onSubmit}>
          <Typography variant="h6">Date: {date.toDateString()} </Typography>
          <Typography variant="h6">Day: ? </Typography>
          <TextField
            value={treatment.diagnosis}
            onChange={(ev) => handleFieldChange("diagnosis", ev.target.value)}
            label="Diagnosis/Findings"
            variant="outlined"
            required
          />
          <br></br>
          <FormControl>
            <InputLabel>Pet</InputLabel>
            <Select
              label="Pet"
              value={treatment.pet_id || ""}
              onChange={(ev) => handleFieldChange("pet_id", ev.target.value)}
              fullWidth
              variant="standard"
            >
              {pets.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            value={treatment.deposit}
            label="Breed"
            variant="standard"
            disabled
          />
          <br></br>
          <Stack flexDirection={"row"}>
            <Stack display={"flex"} flexDirection={"column"} padding={"10px"}>
              <TextField
                value={treatment.bw}
                onChange={(ev) => handleFieldChange("bw", ev.target.value)}
                label="BW"
                variant="standard"
                size="small"
                required
              />
              <TextField
                value={treatment.hr}
                onChange={(ev) => handleFieldChange("hr", ev.target.value)}
                label="HR"
                variant="standard"
                size="small"
                required
              />
              <TextField
                value={treatment.mm}
                onChange={(ev) => handleFieldChange("mm", ev.target.value)}
                label="MM"
                variant="standard"
                size="small"
                required
              />
              <TextField
                value={treatment.pr}
                onChange={(ev) => handleFieldChange("pr", ev.target.value)}
                label="PR"
                variant="standard"
                size="small"
                required
              />
            </Stack>
            <Stack display={"flex"} flexDirection={"column"} padding={"10px"}>
              <TextField
                value={treatment.temp}
                onChange={(ev) => handleFieldChange("temp", ev.target.value)}
                label="Temp"
                variant="standard"
                size="small"
                required
              />
              <TextField
                value={treatment.rr}
                onChange={(ev) => handleFieldChange("rr", ev.target.value)}
                label="RR"
                variant="standard"
                size="small"
                required
              />

              <TextField
                value={treatment.crt}
                onChange={(ev) => handleFieldChange("crt", ev.target.value)}
                label="CRT"
                variant="standard"
                size="small"
                required
              />
              <TextField
                value={treatment.bcs}
                onChange={(ev) => handleFieldChange("bcs", ev.target.value)}
                label="BCS"
                variant="standard"
                size="small"
                required
              />
            </Stack>
          </Stack>

          <br></br>
          <Button color="primary" variant="contained" onClick={onSubmit}>
            Save
          </Button>
        </form>
      )}
    </Paper>
  );
}
