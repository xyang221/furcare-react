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
    species,
    selectedSpecie,
    handleSpecieChange,
    breeds,
    pet,
    setPet,
    errors,
    setImageData,
    isUpdate,
    petownerid,
    addImage,
    handleImage,
    uploadImage,
    specie,
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

  const colors = [
    { id: "Black", color: "Black" },
    { id: "White", color: "White" },
    { id: "Brown", color: "Brown" },
    { id: "Cream", color: "Cream" },
    { id: "Grey", color: "Grey" },
    { id: "Yellow", color: "Yellow" },
    { id: "Red", color: "Red" },
    { id: "Others", color: "Others" },
  ];

  const [selectedOption, setSelectedOption] = useState("");
  const [otherText, setOtherText] = useState("");

  const handleDropdownChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    handleFieldChange("color", value);

    // Clear the otherText state when a different option is selected
    if (value !== "Others") {
      setOtherText("");
    }
  };

  const handleOtherTextChange = (event) => {
    setOtherText(event.target.value);
    handleFieldChange("color", event.target.value);
  };

  // When updating, set selectedOption based on pet.color
  useEffect(() => {
    const colorMatch = colors.find((color) => color.color === pet.color);
    if (colorMatch) {
      setSelectedOption(colorMatch.color);
    } else {
      setSelectedOption("Others");
      setOtherText(pet.color)
    }
  }, [pet.color]);

  return (
    <>
      <>
        {/* <Backdrop open={loading} style={{ zIndex: 999 }}>
          <CircularProgress color="inherit" />
        </Backdrop> */}

        {uploadImage && (
          <>
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
                    InputLabelProps={{ shrink: true }}
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
              <form onSubmit={(e) => onSubmit(e)}>
                <Stack spacing={2} margin={2}>
                  <TextField
                    variant="outlined"
                    id="Name"
                    label="Name"
                    value={pet.name || ``}
                    onChange={(ev) =>
                      handleFieldChange("name", ev.target.value)
                    }
                    required
                  />

                  <TextField
                    label="Birthdate"
                    variant="outlined"
                    id="Birthdate"
                    type="date"
                    value={pet.birthdate || ``}
                    onChange={(ev) =>
                      handleFieldChange("birthdate", ev.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                    required
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
                      required
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

                  <FormControl>
                    <InputLabel>Specie</InputLabel>
                    <Select
                      label="Specie"
                      value={selectedSpecie || ""}
                      onChange={handleSpecieChange}
                      required
                      fullWidth
                    >
                      {species.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.specie}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {selectedSpecie && (
                    <FormControl>
                      <InputLabel>Breed</InputLabel>
                      <Select
                        label="Breed"
                        value={pet.breed_id || ""}
                        onChange={(ev) =>
                          handleFieldChange("breed_id", ev.target.value)
                        }
                        required
                        fullWidth
                      >
                        {breeds.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.breed}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  <FormControl>
                    <InputLabel>Color</InputLabel>
                    <Select
                      label="Color"
                      value={selectedOption || ""}
                      onChange={handleDropdownChange}
                      required
                    >
                      {colors.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.color}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {selectedOption === "Others" && (
                    <TextField
                      type="text"
                      value={otherText || ""}
                      onChange={handleOtherTextChange}
                      placeholder="Enter the other color"
                    />
                  )}

                  <Button color="primary" variant="contained" type="submit">
                    Save
                  </Button>
                </Stack>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </>
    </>
  );
}
