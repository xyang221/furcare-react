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
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Add, Archive, Close, Delete, Edit } from "@mui/icons-material";

export default function TestResultModal(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    testresult,
    setTestresult,
    pets,
    errors,
    setImageData,
    isUpdate,
    petid,
    addImage,
    handleImage,
    uploadImage,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    // Create a copy of the user object and update the specified field
    const updatedTestresult = { ...testresult, [fieldName]: value };
    // Update the user object with the updated value
    setTestresult(updatedTestresult);
  };
  // const [error, setError] = useState(null);

  // const [image, setImage] = useState({
  //   name: null,
  // });


  // const submitImage = (e) => {
  //   e.preventDefault();

  //   if (!image.name) {
  //     setError("Please select an image to upload.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("photo", image.name);

  //   axiosClient
  //     .post(`/pet/upload-image`, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     })
  //     .then((res) => {
  //       console.log(res);
  //       // Clear the input after successful submission
  //       setImage({ name: null });
  //       setError(null);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

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
                  {errors && <p style={{ color: "red" }}>{errors}</p>}
                  {/* <Button type="submit" variant="contained" color="primary">
          Upload
        </Button> */}
                  {/* </form> */}
                  <Button
                    color="primary"
                    variant="contained"
                    // onClick={submitImage}
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
              {isUpdate ? "Update Test Result" : "Add Test Result"}
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
                {petid ? (
                  <FormControl>
                    <InputLabel>Pet</InputLabel>
                    <Select
                      label="Pet"
                      // value={pet.petowner_id || petownerid|| ""}
                      value={testresult.pet_id || null}
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
                      value={testresult.pet_id || null}
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
                {/* {addImage && ( */}
                  <FormControl>
                    <TextField
                      variant="outlined"
                      id="photo"
                      label="Photo"
                      type="file"
                      onChange={handleImage}
                    />
                    {errors && <p style={{ color: "red" }}>{errors}</p>}
                  </FormControl>
                {/* )} */}
             

                <TextField
                  variant="outlined"
                  id="Description"
                  label="Description"
                  value={testresult.description || ``}
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
    </>
  );
}
