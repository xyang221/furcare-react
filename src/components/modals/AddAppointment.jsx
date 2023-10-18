import React, { useEffect, useState } from "react";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Stack,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import { Add, Archive, Close, Delete, Edit } from "@mui/icons-material";

export default function AddAppointment(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    petowners,
    appointment,
    setAppointment,
    errors,
    isUpdate,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    // Create a copy of the appointment object and update the specified field
    const updatedAppointment = { ...appointment, [fieldName]: value };
    // Update the appointment object with the updated value
    setAppointment(updatedAppointment);
  };

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            Create Appointment
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
              <TextField
                variant="outlined"
                id="Date"
                label="Date"
                type="date"
                value={appointment.date}
                onChange={(ev) => handleFieldChange("date", ev.target.value)}
              />

              <Select
                label="Pet Owner"
                value={appointment.petowner_id || ""}
                onChange={(ev) =>
                  handleFieldChange("petowner_id", ev.target.value)
                }
              >
                {petowners.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {`${item.firstname} ${item.lastname}`}
                  </MenuItem>
                ))}
              </Select>

              {/* <InputLabel>Client</InputLabel> */}
              <Select
                label="Client"
                value={appointment.client_service_id || ""}
                onChange={(ev) =>
                  handleFieldChange("client_service_id", ev.target.value)
                }
                placeholder="Client"
              >
                {petowners.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {`${item.firstname} ${item.lastname}`}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                variant="outlined"
                id="Purpose"
                label="Purpose"
                value={appointment.purpose}
                onChange={(ev) => handleFieldChange("purpose", ev.target.value)}
              />

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
