import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import styled from "@emotion/styled";
import { Pets } from "@mui/icons-material";
import { Alert, Link } from "@mui/material";

import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";

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

export default function Login() {
  const {user,updateUser, setToken, setRole, token } = useStateContext();

  // if (token) {
  //   return <Navigate to="/" />;
  // }

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const usernameRef = useRef();
  const passwordRef = useRef();

  const [errors, setErrors] = useState(null);

  const onSubmit = (ev) => {
    ev.preventDefault();
    const payload = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    setErrors(null);

    axiosClient
      .post("/login", payload)
      .then(({ data }) => {
        // setUser(data.user.username);
        // console.log(user)
        updateUser(data.user)
        // setUser(data.user.id);
        setToken(data.token);
        setRole(data.user.role_id);
        navigate("/")
        
        // navigate(from, { replace: true });
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          if (response.data.errors) {
            setErrors(response.data.errors);
          } else {
            setErrors({
              email: [response.data.message],
            });
          }
        }
      });
  };

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
    position: "fixed",
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(0,0,30,0.4)",
  });

  return (
    <Background>
      <CssBaseline />
      <Container
        sx={{ backgroundColor: "white", borderRadius: "5%" }}
        component="main"
        maxWidth="xs"
      >
        <Box
          sx={{
            marginTop: "25%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          p={2}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <Pets />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
            {errors && (
              <Box>
                {Object.keys(errors).map((key) => (
                  <Alert severity="error" key={key}>
                    {errors[key][0]}
                  </Alert>
                ))}
              </Box>
            )}
            <TextField
              inputRef={usernameRef}
              margin="normal"
              fullWidth
              id="username"
              label="Username"
              type="text"
              name="username"
              autoFocus
            />
            <TextField
              inputRef={passwordRef}
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </Background>
  );
}
