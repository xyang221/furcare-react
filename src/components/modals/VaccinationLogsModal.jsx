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
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TableBody,
  TableCell,
  TableRow,
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
    vaccination,
    setVaccination,
    vaccinationdesc,
    vaccination_againsts,
    againsts,
    checkedItems,
    setCheckedItems,
    handleCheckboxChange,
    errors,
    isUpdate,
    selectedItems,
    setSelectedItems
  } = props;

  const handleFieldChange = (fieldName, value) => {
    // Create a copy of the vaccination object and update the specified field
    const updatedLogs = { ...vaccination, [fieldName]: value };
    // Update the vaccination object with the updated value
    setVaccination(updatedLogs);
  };

  return (
    <>
      {/* <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop> */}

      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {isUpdate ? "Update Vaccination" : "Add Vaccination"}
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
              {isUpdate ? (
                <FormControl>
                  <InputLabel>Pet</InputLabel>
                  <Select
                    label="Pet"
                    value={vaccination.pet_id || ""}
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
              ) : (
                <FormControl>
                  <InputLabel>Pet</InputLabel>
                  <Select
                    label="Pet"
                    value={vaccination.pet_id || ""}
                    onChange={(ev) =>
                      handleFieldChange("pet_id", ev.target.value)
                    }
                  >
                    {pets.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <TextField
                variant="outlined"
                id="Weight"
                label="Weight"
                type="number"
                sx={{ width: "30%" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">kg</InputAdornment>
                  ),
                }}
                value={vaccination.weight}
                onChange={(ev) => handleFieldChange("weight", ev.target.value)}
              />

              <Box border={1} p={2}>
                <TableBody>
                  <InputLabel>Against</InputLabel>

                  {againsts.map((item) => (
                    <TableRow hover role="checkbox" key={item.id}>
                      <Checkbox
                        checked={vaccination.vaccination_againsts.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                      <TableCell> {item.acronym} </TableCell>
                      <TableCell> {item.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Box>

              <TextField
                variant="outlined"
                id="Description"
                label="Description"
                multiline
                defaultValue={vaccinationdesc}
                value={vaccination.description}
                onChange={(ev) =>
                  handleFieldChange("description", ev.target.value)
                }
              />

              <FormControl>
                <InputLabel>Doctor</InputLabel>
                <Select
                  label="Administered"
                  value={vaccination.administered || ""}
                  onChange={(ev) =>
                    handleFieldChange("administered", ev.target.value)
                  }
                >
                  <MenuItem></MenuItem>
                  <MenuItem value="Doctor Reina">Doctor Reina</MenuItem>
                  <MenuItem value="Doctor Philip">Doctor Philip</MenuItem>
                </Select>
              </FormControl>

              <TextField
                variant="outlined"
                id="Status"
                label="Status"
                value={vaccination.status}
                onChange={(ev) => handleFieldChange("status", ev.target.value)}
              />

              {/* <TextField
                variant="outlined"
                id="Administered"
                label="Administered"
                value={vaccination.administered}
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
