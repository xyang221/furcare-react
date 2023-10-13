import React, { useEffect, useState } from "react";
import {
  Alert,
  Autocomplete,
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

export default function PetOwnerEdit(props) {
  const {
    open,
    onClose,
    onClick,
    id,
    onSubmit,
    loading,
    petowner,
    setPetowner, 
    address,
    setAddress,
    zipcode,
    errors,
    isUpdate,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    // Create a copy of the user object and update the specified field
    const updatedPetOwner = { ...petowner, [fieldName]: value };
    // Update the user object with the updated value
    setPetowner(updatedPetOwner);
  };

  const handleFieldChangeAddress = (fieldName, value) => {
    // Create a copy of the user object and update the specified field
    const updatedAddress = { ...address, [fieldName]: value };
    // Update the user object with the updated value
    setAddress(updatedAddress);
  };

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {isUpdate ? "Update " : "Registration"}
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
                id="firstname"
            label="Firstname"
            value={petowner.firstname}
                onChange={(ev) => handleFieldChange("firstname", ev.target.value)}
              />
              <TextField
                variant="outlined"
                id="Lastname"
                label="Lastname"
                value={petowner.lastname}
                onChange={(ev) => handleFieldChange("lastname", ev.target.value)}
              />
              <TextField
                variant="outlined"
                id="Contact Number"
                label="Contact Number"
                type="number"
                value={petowner.contact_num}
                onChange={(ev) => handleFieldChange("contact_num", ev.target.value)}
              />
              <TextField
                variant="outlined"
                id="Zone"
            label="Zone"
            value={address.zone}
                onChange={(ev) =>
                  handleFieldChangeAddress("zone", ev.target.value)
                }
              />
              <TextField
                variant="outlined"
                id="Barangay"
            label="Barangay"
            value={address.barangay}
                onChange={(ev) =>
                  handleFieldChangeAddress("barangay", ev.target.value)
                }
              />
              {/* <Autocomplete
            sx={{ width: "100%" }}
            getOptionLabel={(option) =>
              `${option.area}, ${option.province}, ${option.zipcode}`
            }
            options={zipcode}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            noOptionsText="Not Found"
            renderOption={(props, option) => (
              <li {...props}>
                {option.area}, {option.province}, {option.zipcode}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="City, Province, Zipcode" />
            )}
            onChange={(event, newValue) => {
              setValue(newValue);
              setAddress((prevAddress) => ({
                ...prevAddress,
                zipcode_id: newValue ? newValue.id : prevAddress.zipcode_id,
              }));
            }}
            value={value}
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
