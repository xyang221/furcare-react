import React, { useEffect, useState } from "react";
import {
  Button,
  Alert,
  Backdrop,
  Box,
  CircularProgress,
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
} from "@mui/material";
import { Close } from "@mui/icons-material";

export default function DiagnosisModal(props) {
  const {
    open,
    onClose,
    onSubmit,
    loading,
    petname,
    diagnosis,
    setDiagnosis,
    errors,
    pets,
    addpet,
    isUpdate
  } = props;

  const handleFieldChange = (fieldName, value) => {
    // Create a copy of the breed object and update the specified field
    const updatedDiagnosis = { ...diagnosis, [fieldName]: value };
    // Update the breed object with the updated value
    setDiagnosis(updatedDiagnosis);
  };

  const [date, setDate] = useState(new Date());

  return (
    <>
      {/* <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop> */}
      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            Consultation
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

            <form onSubmit={(e) => onSubmit(e)} on>
              <Stack spacing={2} margin={2}>
                  <Typography variant="h6">
                    Date: {date.toDateString()}{" "}
                  </Typography>
                <TextField
                  label="Price"
                  variant="standard"
                  type="number"
                  value={diagnosis.unit_price || ""}
                  onChange={(ev) => handleFieldChange("unit_price", ev.target.value)}
                />
                <FormControl>
                  <InputLabel>Pet</InputLabel>
                  <Select
                    label="Pet"
                    value={diagnosis.pet_id || ""}
                    onChange={(ev) =>
                      handleFieldChange("pet_id", ev.target.value)
                    }
                    readOnly={isUpdate}
                    required
                  >
                    {pets.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  id="outlined-multiline-static"
                  label="Diagnosis"
                  multiline
                  rows={5}
                  fullWidth
                  placeholder="write your diagnosis here..."
                  value={diagnosis.remarks || ""}
                  onChange={(ev) =>
                    handleFieldChange("remarks", ev.target.value)
                  }
                  required
                />

                <br></br>

                <Button color="primary" variant="contained" type="submit">
                  Save
                </Button>
              </Stack>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
