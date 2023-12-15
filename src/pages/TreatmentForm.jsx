import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PetConditionAdmission from "./PetConditionAdmission";
import PetMedicationAdmission from "./PetMedicationAdmission";
import { Refresh } from "@mui/icons-material";

export default function TreatmentForm({ sid }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();

  const [treatment, setTreatment] = useState({
    id: null,
    pet_id: null,
    diagnosis: "",
    body_weight: "",
    heart_rate: "",
    mucous_membranes: "",
    pr_prealbumin: "",
    temperature: "",
    respiration_rate: "",
    caspillar_refill_time: "",
    body_condition_score: "",
    fluid_rate: "",
    comments: "",
  });

  const [pets, setPets] = useState([]);
  const getPetownerPets = () => {
    axiosClient
      .get(`/petowners/${id}/pets`)
      .then(({ data }) => {
        setPets(data.data);
      })
      .catch(() => {});
  };

  const getCurrentTreatment = () => {
    axiosClient
      .get(`/treatments/petowner/${id}/service/${sid}`)
      .then(({ data }) => {
        setTreatment(data);
      })
      .catch(() => {});
  };

  const onSubmit = (e) => {
    e.preventDefault();

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
        .post(`/treatments/petowner/${id}/service/${sid}`, treatment)
        .then((response) => {
          console.log(treatment);
          setNotification("treatment successfully created");
          setTreatment(response.data);
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
    const updatedTreatment = { ...treatment, [fieldName]: value };

    setTreatment(updatedTreatment);
  };

  const handleRefresh = () => {
    getPetownerPets();
    getCurrentTreatment();
  };

  return (
    <Paper
      sx={{
        display: "flex",
      }}
    >
      <Stack
        sx={{
          border: "1px solid black",
          margin: "10px",
          padding: "10px",
          display: "flex",
          textAlign: "center",
        }}
      >
        <Typography variant="h4">
          Treatment Sheet{" "}
          <IconButton color="success" onClick={handleRefresh}>
            <Refresh />
          </IconButton>
        </Typography>
        {loading && <div className="text-center">Loading...</div>}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={(e) => onSubmit(e)}>
            {treatment.id ? (
              <Typography variant="h6">Date: {treatment.date}</Typography>
            ) : (
              <Typography variant="h6">Date: {date.toDateString()} </Typography>
            )}
            <Typography variant="h6">Day: ? </Typography>
            <Box>
              <TextField
                value={treatment.diagnosis}
                onChange={(ev) =>
                  handleFieldChange("diagnosis", ev.target.value)
                }
                label="Diagnosis/Findings"
                variant="outlined"
                size="small"
              rows={2}
                fullWidth
                multiline
                required
              />
            </Box>
            <br></br>
            <FormControl fullWidth>
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
                    {/* {item.name} */}
                    {`${item.name} (Breed: ${item.breed.breed})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <br></br>
            <Stack flexDirection={"row"}>
              <Stack display={"flex"} flexDirection={"column"} padding={"10px"}>
                <TextField
                  value={treatment.body_weight}
                  onChange={(ev) =>
                    handleFieldChange("body_weight", ev.target.value)
                  }
                  label="BW"
                  variant="standard"
                  size="small"
                  required
                  type="number"
                />
                <TextField
                  value={treatment.heart_rate}
                  onChange={(ev) =>
                    handleFieldChange("heart_rate", ev.target.value)
                  }
                  label="HR"
                  variant="standard"
                  size="small"
                  type="number"
                  required
                />
                <TextField
                  value={treatment.mucous_membranes}
                  onChange={(ev) =>
                    handleFieldChange("mucous_membranes", ev.target.value)
                  }
                  label="MM"
                  variant="standard"
                  size="small"
                  type="number"
                  required
                />
                <TextField
                  value={treatment.pr_prealbumin}
                  onChange={(ev) =>
                    handleFieldChange("pr_prealbumin", ev.target.value)
                  }
                  label="PR"
                  variant="standard"
                  size="small"
                  type="number"
                  required
                />
                <TextField
                  value={treatment.temperature}
                  onChange={(ev) =>
                    handleFieldChange("temperature", ev.target.value)
                  }
                  label="Temp"
                  variant="standard"
                  size="small"
                  type="number"
                  required
                />
              </Stack>
              <Stack display={"flex"} flexDirection={"column"} padding={"10px"}>
                <TextField
                  value={treatment.respiration_rate}
                  onChange={(ev) =>
                    handleFieldChange("respiration_rate", ev.target.value)
                  }
                  label="RR"
                  variant="standard"
                  size="small"
                  type="number"
                  required
                />

                <TextField
                  value={treatment.caspillar_refill_time}
                  onChange={(ev) =>
                    handleFieldChange("caspillar_refill_time", ev.target.value)
                  }
                  label="CRT"
                  variant="standard"
                  size="small"
                  type="number"
                  required
                />
                <TextField
                  value={treatment.body_condition_score}
                  onChange={(ev) =>
                    handleFieldChange("body_condition_score", ev.target.value)
                  }
                  label="BCS"
                  variant="standard"
                  size="small"
                  type="number"
                  required
                />
                <TextField
                  value={treatment.fluid_rate}
                  onChange={(ev) =>
                    handleFieldChange("fluid_rate", ev.target.value)
                  }
                  label="FR"
                  variant="standard"
                  size="small"
                  type="number"
                  required
                />
              </Stack>
            </Stack>
            <TextField
              value={treatment.comments}
              onChange={(ev) => handleFieldChange("comments", ev.target.value)}
              label="Comments"
              variant="outlined"
              size="small"
              type="text"
              multiline
              rows={5}
              fullWidth
              required
            />
            <br></br>
            <Button color="primary" variant="contained" type="submit" sx={{marginTop:"15px"}} fullWidth>
              Save
            </Button>
          </form>
        )}
      </Stack>
      <Stack sx={{ display: "flex", flexDirection: "column" }}>
        <PetConditionAdmission tid={treatment.id} />
        <PetMedicationAdmission tid={treatment.id} />
      </Stack>
    </Paper>
  );
}
