import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PetConditionAdmission from "./PetConditionAdmission";
import PetMedicationAdmission from "./PetMedicationAdmission";

export default function TreatmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);

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

  const [pet, setPet] = useState([]);
  const [breed, setBreed] = useState([]);
  const [edittreatment, setEdittreatment] = useState(false);

  const getCurrentTreatment = () => {
    axiosClient
      .get(`/treatments/${id}`)
      .then(({ data }) => {
        setTreatment(data);
        setPet(data.pet);
        setBreed(data.pet.breed);
      })
      .catch(() => {});
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (edittreatment) {
      axiosClient
        .put(`/treatments/${treatment.id}`, treatment)
        .then(() => {
          setEdittreatment(false);
          getCurrentTreatment();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  const handleFieldChange = (fieldName, value) => {
    const updatedTreatment = { ...treatment, [fieldName]: value };

    setTreatment(updatedTreatment);
  };

  const onEdit = () => {
    setEdittreatment(true);
  };

  const onCancel = () => {
    setEdittreatment(false);
    getCurrentTreatment();
  };

  useEffect(() => {
    getCurrentTreatment();
  }, []);

  return (
    <Paper
      sx={{
        width: "80%",
        margin: "auto",
        padding: "10px",
      }}
    >
      <Stack
        sx={{
          display: "flex",
          textAlign: "center",
        }}
      >
        <Box
          flexDirection={"row"}
          justifyContent={"space-between"}
          display={"flex"}
        >
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
            sx={{ width: "10%" }}
          >
            back
          </Button>
          <Button
            variant="contained"
            // onClick={() => navigate(-1)}
            sx={{ width: "10%" }}
            color="success"
          >
            print
          </Button>
        </Box>
        <form onSubmit={(e) => onSubmit(e)}>
          <Typography variant="h5" fontWeight={"bold"}>
            Treatment Sheet{" "}
          </Typography>

          {errors && (
            <div className="alert">
              {Object.keys(errors).map((key) => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          )}
          <Typography variant="body1">Date: {treatment.date}</Typography>
          <Typography variant="body1">Day: {treatment.day} </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              paddingTop: "15px",
            }}
          >
            <TextField
              sx={{ width: "48%" }}
              value={treatment.diagnosis}
              onChange={(ev) => handleFieldChange("diagnosis", ev.target.value)}
              label="Diagnosis/Findings"
              variant="outlined"
              size="small"
              required
              InputProps={{
                readOnly: edittreatment ? false : true,
              }}
            />
            <TextField
              sx={{ width: "48%" }}
              value={`${pet.name} (Breed: ${breed.breed})`}
              onChange={(ev) =>
                handleFieldChange("body_weight", ev.target.value)
              }
              label="Pet"
              size="small"
              required
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>

          <Stack flexDirection={"row"} justifyContent={"space-evenly"}>
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
                InputProps={{
                  readOnly: edittreatment ? false : true,
                }}
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
                InputProps={{
                  readOnly: edittreatment ? false : true,
                }}
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
                InputProps={{
                  readOnly: edittreatment ? false : true,
                }}
              />
            </Stack>
            <Stack display={"flex"} flexDirection={"column"} padding={"10px"}>
              <TextField
                value={treatment.pr_prealbumin}
                onChange={(ev) =>
                  handleFieldChange("pr_prealbumin", ev.target.value)
                }
                label="PR"
                variant="standard"
                size="small"
                type="number"
                InputProps={{
                  readOnly: edittreatment ? false : true,
                }}
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
                InputProps={{
                  readOnly: edittreatment ? false : true,
                }}
              />
              <TextField
                value={treatment.respiration_rate}
                onChange={(ev) =>
                  handleFieldChange("respiration_rate", ev.target.value)
                }
                label="RR"
                variant="standard"
                size="small"
                type="number"
                InputProps={{
                  readOnly: edittreatment ? false : true,
                }}
              />
            </Stack>
            <Stack display={"flex"} flexDirection={"column"} padding={"10px"}>
              <TextField
                value={treatment.caspillar_refill_time}
                onChange={(ev) =>
                  handleFieldChange("caspillar_refill_time", ev.target.value)
                }
                label="CRT"
                variant="standard"
                size="small"
                type="number"
                InputProps={{
                  readOnly: edittreatment ? false : true,
                }}
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
                InputProps={{
                  readOnly: edittreatment ? false : true,
                }}
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
                InputProps={{
                  readOnly: edittreatment ? false : true,
                }}
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
            InputProps={{
              readOnly: edittreatment ? false : true,
            }}
            multiline
            rows={2}
            fullWidth
          />
          <Box display="flex" justifyContent={"right"}>
            {edittreatment && (
              <>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  sx={{ mt: 1, ml: 1 }}
                  onClick={onCancel}
                >
                  cancel
                </Button>
              </>
            )}
            {!edittreatment && (
              <Button
                onClick={onEdit}
                variant="contained"
                color="info"
                size="small"
                sx={{ mt: 1 }}
              >
                Edit
              </Button>
            )}{" "}
          </Box>
        </form>
      </Stack>
      <Divider sx={{ mt: 1 }} />
      <PetConditionAdmission tid={treatment.id} />
      <Divider />
      <PetMedicationAdmission tid={treatment.id} pid={pet.petowner_id} />
    </Paper>
  );
}
