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
  FormControlLabel,
  FormLabel,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Radio,
  RadioGroup,
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
    petowners,
    errors,
    setImageData,
    isUpdate,
    petownerid,
    addImage,
    handleImage,
    uploadImage,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    // Create a copy of the user object and update the specified field
    const updatedPet = { ...pet, [fieldName]: value };
    // Update the user object with the updated value
    setPet(updatedPet);
  };

  const [image, setImage] = useState({
    name: null,
  });

  const [error, setError] = useState(null);

  const submitImage = (e) => {
    e.preventDefault();

    if (!image.name) {
      setError("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", image.name);

    axiosClient
      .post(`/pet/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        // Clear the input after successful submission
        setImage({ name: null });
        setError(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // const handleAddPhoto = (file) => {
  //   if (file && file.length > 0) {
  //     setImageData(file[0]);
  //   }
  // };

  return (
    <>
      <>
        <Backdrop open={loading} style={{ zIndex: 999 }}>
          <CircularProgress color="inherit" />
        </Backdrop>

        {uploadImage && (
          <>
            {/* {!loading && ( */}
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
              <DialogTitle>
                Upload Image
                <IconButton onClick={onClick} style={{ float: "right" }}>
                  <Close color="primary"></Close>
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <Stack spacing={2} margin={2}>
                  {/* <form onSubmit={submitImage} encType="multipart/form-data"> */}
                  <TextField
                    variant="outlined"
                    id="photo"
                    label="Photo"
                    type="file"
                    onChange={handleImage}
                    defaultValue={null}
                  />
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  {/* <Button type="submit" variant="contained" color="primary">
          Upload
        </Button> */}
                  {/* </form> */}
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={submitImage}
                  >
                    Save
                  </Button>
                </Stack>
              </DialogContent>
            </Dialog>
            {/* )} */}
          </>
        )}
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
                {addImage && (
                  <FormControl>
                    <TextField
                      variant="outlined"
                      id="photo"
                      label="Photo"
                      type="file"
                      onChange={handleImage}
                      defaultValue={null}
                    />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                  </FormControl>
                )}
                {petownerid ? (
                  <FormControl>
                    <InputLabel>Pet Owner</InputLabel>
                    <Select
                      label="Pet Owner"
                      // value={pet.petowner_id || petownerid|| ""}
                      value={petownerid || ""}
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
                  <FormControl>
                    <InputLabel>Pet Owner</InputLabel>
                    <Select
                      label="Pet Owner"
                      value={pet.petowner_id || ""}
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
                )}

                <TextField
                  variant="outlined"
                  id="Name"
                  label="Name"
                  value={pet.name || ``}
                  onChange={(ev) => handleFieldChange("name", ev.target.value)}
                />

                <TextField
                  label="Birthdate"
                  variant="outlined"
                  id="Birthdate"
                  type="date"
                  value={pet.birthdate || ``}
                  defaultValue={null}
                  onChange={(ev) =>
                    handleFieldChange("birthdate", ev.target.value)
                  }
                />

                <FormControl>
                  <FormLabel id="demo-controlled-radio-buttons-group">
                    Gender
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={pet.gender || ``}
                    onChange={(ev) =>
                      handleFieldChange("gender", ev.target.value)
                    }
                  >
                    <FormControlLabel
                      value="Female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="Male"
                      control={<Radio />}
                      label="Male"
                    />
                  </RadioGroup>
                </FormControl>

                <TextField
                  variant="outlined"
                  id="Color"
                  label="Color"
                  value={pet.color || ``}
                  onChange={(ev) => handleFieldChange("color", ev.target.value)}
                />
                <FormControl>
                  <InputLabel>Breed</InputLabel>
                  <Select
                    label="Breed"
                    value={pet.breed_id || ""}
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
