import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { Link, useParams } from "react-router-dom";
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
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Add, Archive, Close, Delete, Edit } from "@mui/icons-material";

export default function PetsModal(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    breeds,
    pet,
    setPet,
    errors,
    setImageData,
    isUpdate,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    // Create a copy of the user object and update the specified field
    const updatedPet = { ...pet, [fieldName]: value };
    // Update the user object with the updated value
    setPet(updatedPet);
  };

  const handleAddPhoto = (file) => {
    setImageData(file[0]);
  };

  return (
    <>
      <>
        <Backdrop open={loading} style={{ zIndex: 999 }}>
          <CircularProgress color="inherit" />
        </Backdrop>
        {!loading && (
          <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
              {isUpdate ? "Update Pet" : "Add Pet"}
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
                {/* <TextField
                  variant="outlined"
                  id="Photo"
                  label="Photo"
                  // component="input"
                  type="file"
                  // value={pet.photo}
                  onChange={(ev) => handleAddPhoto(ev.target.files)}
                /> */}

                <TextField
                  variant="outlined"
                  id="Name"
                  label="Name"
                  value={pet.name || ``}
                  onChange={(ev) => handleFieldChange("name", ev.target.value)}
                />

                <TextField
                  label="Date"
                  variant="outlined"
                  id="Birthdate"
                  type="date"
                  value={pet.birthdate || ``}
                  onChange={(ev) =>
                    handleFieldChange("birthdate", ev.target.value)
                  }
                />

                <FormControl>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    label="Gender"
                    value={pet.gender || ``}
                    onChange={(ev) =>
                      handleFieldChange("gender", ev.target.value)
                    }
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  variant="outlined"
                  id="Color"
                  label="Color"
                  value={pet.color || ``}
                  onChange={(ev) => handleFieldChange("color", ev.target.value)}
                />
                <TextField
                  variant="outlined"
                  id="QRCode"
                  label="QRCode"
                  value={pet.qr_code || ``}
                  onChange={(ev) =>
                    handleFieldChange("qr_code", ev.target.value)
                  }
                />

                <FormControl>
                  <InputLabel>Breed</InputLabel>
                  <Select
                    label="Breed"
                    value={pet.breed_id || null}
                    onChange={(ev) =>
                      handleFieldChange("breed_id", ev.target.value)
                    }
                  >
                    {breeds.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.breed}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button color="primary" variant="contained" onClick={onSubmit}>
                  Save
                </Button>
              </Stack>
            </DialogContent>
          </Dialog>
        )}
      </>
    </>
  );
}
