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
} from "@mui/material";
import { Add, Archive, Close, Delete, Edit } from "@mui/icons-material";

export default function EditAppointment(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    petowner,
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
            <form onSubmit={(e) => onSubmit(e)} on >
            <Stack spacing={2} margin={2}>

              {petownerid ? (
                <FormControl>
                  <InputLabel>Pet Owner</InputLabel>
                  <Select
                    label="Pet Owner"
                    value={petownerid}
                    onChange={(ev) =>
                      handleFieldChange("petowner_id", ev.target.value)
                    }
                    disabled
                  >
                    {petowners.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {`${item.firstname} ${item.lastname}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  variant="outlined"
                  id="Pet Owner"
                  label="Pet Owner"
                  value={`${petowner.firstname} ${petowner.lastname}`}
                  disabled
                />
              )}

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
                  required
                />
              ) : (
                <TextField
                  label="Date"
                  variant="outlined"
                  id="Date"
                  type="date"
                  value={appointment.date || ``}
                  // defaultValue={null}
                  onChange={(ev) => handleFieldChange("date", ev.target.value)}
                  required
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
                  required
                >
                  {services.map((item) => (
                    <MenuItem
                      key={item.id}
                      value={item.id}
                      disabled={item.isAvailable === 0}
                    >
                      {`${item.service} (${item.category.category})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                variant="outlined"
                id="Purpose"
                label="Purpose"
                value={appointment.purpose || ""}
                onChange={(ev) => handleFieldChange("purpose", ev.target.value)}
                required
              />

              <TextField
                variant="outlined"
                id="Remarks"
                label="Remarks"
                multiline
                rows={2}
                value={appointment.remarks || ""}
                onChange={(ev) => handleFieldChange("remarks", ev.target.value)}
                required
              />

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
