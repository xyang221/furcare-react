import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";

import { useRef, useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { Pets } from "@mui/icons-material";
import { Autocomplete, InputAdornment } from "@mui/material";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function SignUp() {
  const { setRole, updateUser, setToken, setNotification, notification } = useStateContext();

  // if (token) {
  //   return <Navigate to="/" />;
  // }

  const navigate = useNavigate();

  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const contact_numRef = useRef();
  const zipcode_idRef = useRef();
  const barangayRef = useRef();
  const zoneRef = useRef();

  const [errors, setErrors] = useState(null);
  const [zipcode, setZipcode] = useState(null);

  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = (ev) => {
    ev.preventDefault();
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
      firstname: firstnameRef.current.value,
      lastname: lastnameRef.current.value,
      contact_num: contact_numRef.current.value,
      // zipcode_id: zipcode_idRef.current.value,
      zipcode_id: zipcode,
      barangay: barangayRef.current.value,
      zone: zoneRef.current.value,
    };

    axiosClient
      .post("/signup", payload)
      .then(({ data }) => {
        updateUser(data.user);
        setToken(data.token);
        navigate(from, { replace: true });
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };
  const [address, setAddress] = useState([]);

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

  const imageURL = "../src/assets/furcarebg.jpg";

  const Background = styled("div")({
    width: "100%",
    height: "100%",
    justifyContent: "center",
    backgroundImage: `url(${imageURL})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundBlendMode: "soft-light",
    // position: "fixed",
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(0,0,30,0.4)",
  });

  return (
    <Background>
      <Container
        sx={{ backgroundColor: "white", borderRadius: "5%" }}
        component="main"
        maxWidth="xs"
      >
        <CssBaseline />
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
          }}
          p={2}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <Pets />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          </Box>
          <Box component="form" onSubmit={onSubmit} >
            {errors && (
              <div className="alert">
                {Object.keys(errors).map((key) => (
                  <p key={key}>{errors[key][0]}</p>
                ))}
              </div>
            )}
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  required
                  size="small"
                  inputRef={emailRef}
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  size="small"
                  inputRef={passwordRef}
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  size="small"
                  inputRef={passwordConfirmationRef}
                  fullWidth
                  name="password confirmation"
                  label="Password Confirmation"
                  type="password"
                  id="password confirmation"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  size="small"
                  inputRef={firstnameRef}
                  fullWidth
                  name="Firstname"
                  label="Firstname"
                  id="Firstname"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  size="small"
                  inputRef={lastnameRef}
                  fullWidth
                  name="Lastname"
                  label="Lastname"
                  id="Lastname"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  size="small"
                  inputRef={contact_numRef}
                  fullWidth
                  name="Contact Number"
                  label="Contact Number"
                  id="Contact Number"
                  inputProps={{
                    minLength: 10,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+63</InputAdornment>
                    ),
                  }}
                  type="number"
                  onChange={(e) => {
                    if (contact_numRef.current) {
                      const inputValue = e.target.value;
                      const sanitizedInput = inputValue.slice(0, 10); // Limit input to 10 characters
                      contact_numRef.current.value = sanitizedInput; // Update the ref value
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  size="small"
                  inputRef={zoneRef}
                  fullWidth
                  name="Zone"
                  label="Zone"
                  id="Zone"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  size="small"
                  inputRef={barangayRef}
                  fullWidth
                  name="Barangay"
                  label="Barangay"
                  id="Barangay"
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  sx={{ width: "100%" }}
                  size="small"
                  fullWidth
                  getOptionLabel={(address) =>
                    `${address.area}, ${address.province}, ${address.zipcode}`
                  }
                  options={address}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value?.id
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
                  required
                  onChange={(event, newValue) => {
                      if (newValue && zipcode_idRef.current) {
                        setZipcode(newValue.id);
                      }
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 1 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 5 }} /> */}
      </Container>
    </Background>
  );
}
