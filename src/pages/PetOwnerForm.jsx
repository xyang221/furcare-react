import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import {
  Autocomplete,
  TextField,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Alert,
  InputAdornment,
  Paper,
} from "@mui/material";

export default function PetOwnerForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();

  const [address, setAddress] = useState([]);
  const [value, setValue] = useState(null);

  const [petowner, setPetowner] = useState({
    id: null,
    firstname: "",
    lastname: "",
    contact_num: "",
    zipcode_id: null,
    barangay: "",
    zone: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const onSubmit = (ev) => {
    ev.preventDefault();

    axiosClient
      .post(`/petowners`, petowner)
      .then((response) => {
        setNotification("Pet Owner successfully created");
        const createdPetownerId = response.data.id;
        navigate(`/admin/petowners/${createdPetownerId}/view`);
      })
      .catch((err) => {
        handleErrors(err);
      });
  };

  const getZipcodes = () => {
    axiosClient
      .get("/zipcodes")
      .then(({ data }) => {
        setAddress(data.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    getZipcodes();
  }, []);

  const handleErrors = (err) => {
    const response = err.response;
    if (response && response.status === 422) {
      setErrors(response.data.errors);
    }
  };

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = (e) => {
    e.preventDefault();
    if (activeStep === 1) {
      onSubmit(e);
      return true;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const steps = ["Register Pet Owner", "Create a User Account"];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box
            sx={{
              width: "70%",
              display: "flex",
              flexDirection: "column",
              "& > :not(style)": { m: 1 },
              margin: "auto",
            }}
          >
            <Typography variant="h5" padding={1}>
              Pet Owner Registration
            </Typography>

            <TextField
              variant="outlined"
              size="small"
              id="firstname"
              label="Firstname"
              value={petowner.firstname}
              onChange={(ev) =>
                setPetowner({ ...petowner, firstname: ev.target.value })
              }
              fullWidth
              required
            />
            <TextField
              variant="outlined"
              size="small"
              id="Lastname"
              label="Lastname"
              fullWidth
              value={petowner.lastname}
              onChange={(ev) =>
                setPetowner({ ...petowner, lastname: ev.target.value })
              }
              required
            />
            <TextField
              variant="outlined"
              size="small"
              id="Contact Number"
              label="Contact Number"
              type="number"
              fullWidth
              inputProps={{
                minLength: 10,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+63</InputAdornment>
                ),
              }}
              value={petowner.contact_num}
              onChange={(ev) => {
                const input = ev.target.value.slice(0, 10);
                setPetowner({ ...petowner, contact_num: input });
              }}
              required
            />

            <TextField
              id="Zone"
              size="small"
              label="Zone/Block/Street"
              fullWidth
              value={petowner.zone}
              onChange={(ev) =>
                setPetowner({ ...petowner, zone: ev.target.value })
              }
              required
            />
            <TextField
              id="Barangay"
              label="Barangay"
              size="small"
              fullWidth
              value={petowner.barangay}
              onChange={(ev) =>
                setPetowner({ ...petowner, barangay: ev.target.value })
              }
              required
            />

            <Autocomplete
              sx={{ width: "100%" }}
              size="small"
              fullWidth
              getOptionLabel={(address) =>
                `${address.area}, ${address.province}, ${address.zipcode}`
              }
              options={address}
              isOptionEqualToValue={(option, value) =>
                option.area === value.area
              }
              noOptionsText="Not Found"
              renderOption={(props, address) => (
                <Box component="li" {...props} key={address.id}>
                  {address.area}, {address.province}, {address.zipcode}
                </Box>
              )}
              renderInput={(params) => (
                <TextField {...params} label="City, Province, Zipcode" />
              )}
              onChange={(event, newValue) => {
                setValue(newValue);
                setPetowner({
                  ...petowner,
                  zipcode_id: newValue ? newValue.id : "",
                });
              }}
              value={value}
              required
            />
          </Box>
        );
      case 1:
        return (
          <Box
            sx={{
              width: "70%",
              display: "flex",
              flexDirection: "column",
              "& > :not(style)": { m: 1 },
              margin: "auto",
            }}
          >
            <Typography variant="h5" padding={1}>
              Create an Account
            </Typography>
            <TextField
              id="Email"
              label="Email"
              size="small"
              type="email"
              fullWidth
              value={petowner.email}
              onChange={(ev) =>
                setPetowner({ ...petowner, email: ev.target.value })
              }
              required
            />
            <TextField
              variant="outlined"
              id="Password"
              size="small"
              label="Password"
              type="password"
              required
              fullWidth
              value={petowner.password}
              onChange={(ev) =>
                setPetowner({ ...petowner, password: ev.target.value })
              }
            />
            <TextField
              variant="outlined"
              id="Password Confirmation"
              label="Password Confirmation"
              size="small"
              fullWidth
              required
              type="password"
              value={petowner.password_confirmation}
              onChange={(ev) =>
                setPetowner({
                  ...petowner,
                  password_confirmation: ev.target.value,
                })
              }
            />
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Paper
      sx={{
        width: "50%",
        margin: "auto",
        marginTop: "50px",
        padding: "20px",
        border: "1px solid black",
      }}
    >
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {errors && (
        <Box p={2}>
          {Object.keys(errors).map((key) => (
            <Alert severity="error" key={key}>
              {errors[key][0]}
            </Alert>
          ))}
        </Box>
      )}
      <div margin="auto">
        {activeStep === steps.length ? (
          <div>
            <p>All steps completed</p>
          </div>
        ) : (
          <div >
            <form
              onSubmit={(e) => handleNext(e)}
            >
              {getStepContent(activeStep)}
              <Box sx={{ padding: "10px", alignSelf: "center" }}>
                <Button disabled={activeStep === 0} onClick={handlePrev}>
                  Back
                </Button>
                {activeStep === 0 && (
                  <>
                    <Button variant="contained" color="primary" type="submit">
                      Next
                    </Button>
                  </>
                )}
                {activeStep === 1 && (
                  <>
                    <Button variant="contained" color="primary" type="submit">
                      Save
                    </Button>
                  </>
                )}
              </Box>
            </form>
          </div>
        )}
      </div>
    </Paper>
  );
}
