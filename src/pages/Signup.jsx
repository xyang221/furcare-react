import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import {
  Autocomplete,
  TextField,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  InputAdornment,
  Paper,
  Container,
  CssBaseline,
  Avatar,
  Grid,
} from "@mui/material";
import Swal from "sweetalert2";

export default function Signup() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);

  const [selectedZipcode, setSelectedZipcode] = useState(null);
  const [zipcodeerror, setZipcodeerror] = useState(null);

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

  const [zipcode, setZipcode] = useState({
    id: null,
    area: "",
    province: "",
    zipcode: "",
  });

  const imageURL = "../src/assets/furcarebg.jpg";

  const [activeStep, setActiveStep] = useState(0);

  const steps = ["Create a User Account", "Pet Owner Registration"];

  const onSubmit = (ev) => {
    ev.preventDefault();
    setErrors(null);
    axiosClient
      .post("/signup", petowner)
      .then(({ data }) => {
        if (data?.status === 204) {
          Swal.fire({
            title: "Success",
            text: "You have been successfully registered!",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/login");
            }
          });
        }
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
        if (errors.email || errors.password) {
          setActiveStep(0);
        }
      });
  };

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

  useEffect(() => {
    let timerId;

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      setZipcode({});
      setZipcodeerror(null);
      setErrors(null);
      getZipcodeDetails(selectedZipcode);
    }, 4000);

    return () => clearTimeout(timerId);
  }, [selectedZipcode]);

  const getZipcodeDetails = (query) => {
    if (query) {
      setZipcode({});
      setZipcodeerror(null);

      axiosClient
        .get(`/zipcodedetails/${query}`)
        .then(({ data }) => {
          setZipcode(data.data);
          setPetowner((prevStaff) => ({
            ...prevStaff,
            zipcode_id: data.data.id,
          }));
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 404) {
            setZipcodeerror(response.data.message);
          }
        });
    }
  };

  const handleZipcodeChange = (event) => {
    setSelectedZipcode(event.target.value);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box p={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
                  error={errors && errors.email ? true : false}
                  helperText={errors && errors.email}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
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
                  placeholder="Password should be at least 8 characters long."
                  error={errors && errors.password ? true : false}
                  helperText={errors && errors.password}
                />
              </Grid>
              <Grid item xs={12}>
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
                  placeholder="Password should be at least 8 characters long."
                  error={errors && errors.password_confirmation ? true : false}
                  helperText={errors && errors.password_confirmation}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box p={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
                  error={errors && errors.firstname ? true : false}
                  helperText={errors && errors.firstname}
                />
              </Grid>
              <Grid item xs={12}>
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
                  error={errors && errors.lastname ? true : false}
                  helperText={errors && errors.lastname}
                />
              </Grid>
              <Grid item xs={12}>
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
                  error={errors && errors.contact_num ? true : false}
                  helperText={errors && errors.contact_num}
                />
              </Grid>
              <Grid item xs={12}>
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
                  error={errors && errors.zone ? true : false}
                  helperText={errors && errors.zone}
                />
              </Grid>
              <Grid item xs={12}>
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
                  error={errors && errors.barangay ? true : false}
                  helperText={errors && errors.barangay}
                />
              </Grid>
              <Grid item xs={12} display="flex" flexDirection={"row"}>
                <TextField
                  id="Zipcode"
                  label="Zipcode"
                  size="small"
                  type="number"
                  fullWidth={!zipcode.area}
                  value={selectedZipcode}
                  onChange={handleZipcodeChange}
                  required
                  error={
                    (errors && errors.zipcode_id) || zipcodeerror ? true : false
                  }
                  helperText={(errors && errors.zipcode_id) || zipcodeerror}
                />
                {zipcode.area && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        id="Area"
                        label="Area"
                        size="small"
                        value={zipcode.area || ""}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="Province"
                        label="Province"
                        size="small"
                        value={zipcode.province || ""}
                        required
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return "Unknown step";
    }
  };

  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        backgroundImage: `url(${imageURL})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "soft-light",
        position: "fixed",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(0,0,30,0.4)",
      }}
    >
      <CssBaseline />
      <Container
        sx={{
          backgroundColor: "white",
          borderRadius: "5%",
          p: 1,
          mt: "5%",
        }}
        component="main"
        maxWidth="sm"
      >
        <Box
          sx={{
            marginTop: "5%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              pb: 1,
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }} />
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
          </Box>
          <Stepper activeStep={activeStep} sx={{ mb: 1 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div margin="auto">
            {activeStep === steps.length ? (
              <div>
                <p>All steps completed</p>
              </div>
            ) : (
              <div>
                <form onSubmit={(e) => handleNext(e)}>
                  {getStepContent(activeStep)}
                  <Box
                    sx={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button disabled={activeStep === 0} onClick={handlePrev}>
                      Back
                    </Button>
                    {activeStep === 0 && (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                        >
                          Next
                        </Button>
                      </>
                    )}
                    {activeStep === 1 && (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                        >
                          Save
                        </Button>
                      </>
                    )}
                  </Box>
                </form>
              </div>
            )}
          </div>
          <Box textAlign="center">
            <Typography variant="body1">
              Already have an account?{" "}
              <Link to="/login" variant="body1">
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
}
