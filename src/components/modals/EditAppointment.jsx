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
  FormControl,
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
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function EditAppointment(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    petowners,
    petownerid,
    services,
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
            {isUpdate ? "Update Appointment" : "Create Appointment"}
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
                <InputLabel>Pet Owner</InputLabel>
                <Select
                  label="Pet Owner"
                  value={appointment.petowner_id || petownerid || ""}
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
              </FormControl>

              {isUpdate && (
                <TextField
                  variant="outlined"
                  id="Status"
                  label="Status"
                  value={appointment.status}
                  onChange={(ev) =>
                    handleFieldChange("status", ev.target.value)
                  }
                  disabled
                />
              )}

              {isUpdate ? (
                <TextField
                  variant="outlined"
                  id="Date"
                  label="Date"
                  type="date"
                  // value={appointment.date}
                  value={new Date(appointment.date).toISOString().split("T")[0]}
                  onChange={(ev) => handleFieldChange("date", ev.target.value)}
                />
              ) : (
                <TextField
                label="Date"
                variant="outlined"
                id="Date"
                type="date"
                value={appointment.date || ``}
                defaultValue={null}
                onChange={(ev) =>
                  handleFieldChange("date", ev.target.value)
                }
              />
              )}

              <FormControl>
                <InputLabel>Services</InputLabel>
                <Select
                  label="Services"
                  value={appointment.service_id || ""}
                  onChange={(ev) =>
                    handleFieldChange("service_id", ev.target.value)
                  }
                >
                  {services.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {`${item.service} (${item.category.category})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                variant="outlined"
                id="Purpose"
                label="Purpose"
                value={appointment.purpose}
                onChange={(ev) => handleFieldChange("purpose", ev.target.value)}
              />

              <TextField
                variant="outlined"
                id="Remarks"
                label="Remarks"
                multiline
                rows={3}
                value={appointment.remarks}
                onChange={(ev) => handleFieldChange("remarks", ev.target.value)}
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
