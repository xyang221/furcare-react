import React, { useEffect, useState } from "react";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export default function VaccinationLogsModal(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    pets,
    petid,
    deworminglog,
    setDeworminglog,
    againsts,
    checkedItems,
    setCheckedItems,
    errors,
    isUpdate,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    // Create a copy of the deworminglog object and update the specified field
    const updatedLogs = { ...deworminglog, [fieldName]: value };
    // Update the deworminglog object with the updated value
    setDeworminglog(updatedLogs);
  };

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {isUpdate ? "Update Deworming Log" : "Add Deworming Log"}
            <IconButton onClick={onClick} style={{ float: "right" }}>
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
            <Stack spacing={2} margin={2}>
              <FormControl>
                <InputLabel>Pet</InputLabel>
                <Select
                  label="Pet"
                  value={deworminglog.pet_id || petid}
                  onChange={(ev) =>
                    handleFieldChange("pet_id", ev.target.value)
                  }
                  disabled
                >
                  {pets.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                variant="outlined"
                id="Weight"
                label="Weight"
                type="number"
                value={deworminglog.weight}
                onChange={(ev) => handleFieldChange("weight", ev.target.value)}
              />
              <Box>
                {againsts.map((item) => (
                  <Box hover role="checkbox" key={item.id}>
                    <Checkbox
                      checked={checkedItems[item.id]}
                      onChange={() => {
                        setCheckedItems((prevCheckedItems) => ({
                          ...prevCheckedItems,
                          [item.id]: !prevCheckedItems[item.id],
                        }));
                      }}
                    />
                    <Typography> {item.acronym}</Typography>
                    <Typography> {item.description}</Typography>
                  </Box>
                ))}
              </Box>

              <TextField
                variant="outlined"
                id="Description"
                label="Description"
                value={deworminglog.description}
                onChange={(ev) =>
                  handleFieldChange("description", ev.target.value)
                }
              />

              <TextField
                variant="outlined"
                id="Status"
                label="Status"
                value={deworminglog.status}
                onChange={(ev) => handleFieldChange("status", ev.target.value)}
              />

              <FormControl>
                <InputLabel>Doctor</InputLabel>
                <Select
                  label="Doctor"
                  value={deworminglog.administered || ""}
                  onChange={(ev) =>
                    handleFieldChange("administered", ev.target.value)
                  }
                >
                  <MenuItem></MenuItem>
                  <MenuItem value="Doctor Reina">Doctor Reina</MenuItem>
                  <MenuItem value="Doctor Philip">Doctor Philip</MenuItem>
                </Select>
              </FormControl>

              {/* <TextField
                variant="outlined"
                id="Administered"
                label="Administered"
                value={deworminglog.administered}
                onChange={(ev) => handleFieldChange("administered", ev.target.value)}
              /> */}

              <Button color="primary" variant="contained" onClick={onSubmit}>
                Save
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
