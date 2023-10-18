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
import { Close } from "@mui/icons-material";

export default function BreedsModal(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    species,
    breed,
    setBreed, 
    errors,
    isUpdate,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    // Create a copy of the breed object and update the specified field
    const updatedBreed = { ...breed, [fieldName]: value };
    // Update the breed object with the updated value
    setBreed(updatedBreed);
  };

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {isUpdate ? "Update Breed" : "Add Breed"}
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
          
               {isUpdate ? (<Select
                  label="Specie"
                  value={breed.specie_id || ''}
                  onChange={(ev) => handleFieldChange("specie_id", ev.target.value)}
                  disabled
                >
                  {species.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.specie}
                    </MenuItem>
                  ))}
                </Select>) :
                (<Select
                  label="Specie"
                  value={breed.specie_id || ''}
                  onChange={(ev) => handleFieldChange("specie_id", ev.target.value)}
                >
                  {species.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                       {`${item.specie} (${item.description})`}
                    </MenuItem>
                  ))}
                </Select>)
                }

              <TextField
                variant="outlined"
                id="Breed"
                label="Breed"
                value={breed.breed}
                onChange={(ev) => handleFieldChange("breed", ev.target.value)}
              />
              <TextField
                variant="outlined"
                id="Description"
                label="Description"
                value={breed.description}
                onChange={(ev) => handleFieldChange("description", ev.target.value)}
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
