import React, { useEffect, useState } from "react";
import {
  Button,
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export default function TreatmentModal(props) {
  const {
    open,
    onClose,
    onSubmit,
    treatment,
    setTreatment,
    errors,
    pets,
    isUpdate,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    const updatedTreatment = { ...treatment, [fieldName]: value };

    setTreatment(updatedTreatment);
  };

  const [date, setDate] = useState(new Date());

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {!isUpdate && (
            <TextField
              sx={{ mt: 2 }}
              label="Treatment Cost"
              type="number"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₱</InputAdornment>
                ),
              }}
              value={treatment.unit_price || ""}
              onChange={(ev) =>
                handleFieldChange("unit_price", ev.target.value)
              }
              required
            />
          )}
          <IconButton onClick={onClose} style={{ float: "right" }}>
            <Close color="primary"></Close>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {errors && (
            <Box>
              {Object.keys(errors).map((key) => (
                <Alert severity="error" key={key}>
                  {errors[key][0]}
                </Alert>
              ))}
            </Box>
          )}
          <form onSubmit={(e) => onSubmit(e)}>
            <Typography variant="h5" align="center">
              Treatment Sheet
            </Typography>

            {treatment.id ? (
              <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                Date: {treatment.date}
              </Typography>
            ) : (
              <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                Date: {date.toLocaleDateString()}{" "}
              </Typography>
            )}
            <TextField
              value={treatment.day || ""}
              onChange={(ev) => handleFieldChange("day", ev.target.value)}
              label="Day"
              variant="outlined"
              size="small"
              type="number"
              required
              sx={{ display: "flex", margin: "auto", width: "15%" }}
            />
            <TextField
              value={treatment.diagnosis || ""}
              onChange={(ev) => handleFieldChange("diagnosis", ev.target.value)}
              label="Diagnosis/Findings"
              variant="outlined"
              size="small"
              fullWidth
              multiline
              required
              sx={{ mt: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Pet *</InputLabel>
              <Select
                label="Pet*"
                value={treatment.pet_id || ""}
                onChange={(ev) => handleFieldChange("pet_id", ev.target.value)}
                fullWidth
                size="small"
                sx={{ mt: 2 }}
                required
              >
                {pets.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {`${item.name} (Breed: ${item.breed.breed})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <br></br>
            <Stack flexDirection={"row"}>
              <Stack display={"flex"} flexDirection={"column"} padding={"10px"}>
                <TextField
                  value={treatment.body_weight || ""}
                  onChange={(ev) =>
                    handleFieldChange("body_weight", ev.target.value)
                  }
                  label="BW"
                  variant="standard"
                  size="small"
                  type="number"
                  required
                />
                <TextField
                  value={treatment.heart_rate || ""}
                  onChange={(ev) =>
                    handleFieldChange("heart_rate", ev.target.value)
                  }
                  label="HR"
                  variant="standard"
                  size="small"
                  type="number"
                />
                <TextField
                  value={treatment.mucous_membranes || ""}
                  onChange={(ev) =>
                    handleFieldChange("mucous_membranes", ev.target.value)
                  }
                  label="MM"
                  variant="standard"
                  size="small"
                  type="number"
                />
              </Stack>
              <Stack display={"flex"} flexDirection={"column"} padding={"10px"}>
                <TextField
                  value={treatment.pr_prealbumin || ""}
                  onChange={(ev) =>
                    handleFieldChange("pr_prealbumin", ev.target.value)
                  }
                  label="PR"
                  variant="standard"
                  size="small"
                  type="number"
                />
                <TextField
                  value={treatment.temperature || ""}
                  onChange={(ev) =>
                    handleFieldChange("temperature", ev.target.value)
                  }
                  label="Temp"
                  variant="standard"
                  size="small"
                  type="number"
                />
                <TextField
                  value={treatment.respiration_rate || ""}
                  onChange={(ev) =>
                    handleFieldChange("respiration_rate", ev.target.value)
                  }
                  label="RR"
                  variant="standard"
                  size="small"
                  type="number"
                />
              </Stack>
              <Stack display={"flex"} flexDirection={"column"} padding={"10px"}>
                <TextField
                  value={treatment.caspillar_refill_time || ""}
                  onChange={(ev) =>
                    handleFieldChange("caspillar_refill_time", ev.target.value)
                  }
                  label="CRT"
                  variant="standard"
                  size="small"
                  type="number"
                />
                <TextField
                  value={treatment.body_condition_score || ""}
                  onChange={(ev) =>
                    handleFieldChange("body_condition_score", ev.target.value)
                  }
                  label="BCS"
                  variant="standard"
                  size="small"
                  type="number"
                />
                <TextField
                  value={treatment.fluid_rate || ""}
                  onChange={(ev) =>
                    handleFieldChange("fluid_rate", ev.target.value)
                  }
                  label="FR"
                  variant="standard"
                  size="small"
                  type="number"
                />
              </Stack>
            </Stack>
            <TextField
              value={treatment.comments || ""}
              onChange={(ev) => handleFieldChange("comments", ev.target.value)}
              label="Comments"
              variant="outlined"
              size="small"
              type="text"
              multiline
              rows={3}
              fullWidth
            />
            <br></br>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              sx={{ marginTop: "15px" }}
              fullWidth
            >
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
