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
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Add, Archive, Close, Delete, Edit } from "@mui/icons-material";

export default function EditAppointment(props) {
  const {
    open,
    onClose,
    onClick,
    id,
    onSubmit,
    loading,
    roles,
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
            {isUpdate ? "Update Appointment" : "New Appointment"}
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
                value={appointment.date}
                onChange={(ev) => handleFieldChange("date", ev.target.value)}
              />
              <TextField
                variant="outlined"
                id="Purpose"
                label="Purpose"
                value={appointment.purpose}
                onChange={(ev) => handleFieldChange("purpose", ev.target.value)}
              />
              <TextField
                variant="outlined"
                id="Password"
                label="Password"
                value={appointment.status}
                onChange={(ev) => handleFieldChange("status", ev.target.value)}
              />
              <TextField
                variant="outlined"
                id="Password Confirmation"
                label="Password Confirmation"
                type="password"
                value={appointment.password_confirmation}
                onChange={(ev) =>
                  handleFieldChange("password_confirmation", ev.target.value)
                }
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
