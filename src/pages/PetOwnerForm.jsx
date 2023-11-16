import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import {
  Stack,
  Autocomplete,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Alert,
  InputAdornment,
} from "@mui/material";
import Password from "../components/Password";

export default function PetOwnerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    role_id: 3,
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient
        .get(`/petowners/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setPetowner(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (petowner.id) {
      axiosClient
        .put(`/petowners/${petowner.id}`, petowner)
        .then(() => {
          setNotification("Petowner successfully updated");
          navigate("/admin/petowners");
        })
        .catch((err) => {
          handleErrors(err);
        });
    } else {
      axiosClient
        .post(`/petowners`, petowner)
        .then(() => {
          setNotification("Pet Owner successfully created");
          navigate("/admin/petowners");
        })
        .catch((err) => {
          handleErrors(err);
        });
    }
  };

  const [roles, setRoles] = useState([]);

  const getRoles = () => {
    axiosClient
      .get("/roles")
      .then(({ data }) => {
        setLoading(false);
        setRoles(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getZipcodes = () => {
    axiosClient
      .get("/zipcodes")
      .then(({ data }) => {
        setAddress(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getRoles();
    getZipcodes();
  }, []);

  const handleErrors = (err) => {
    const response = err.response;
    if (response && response.status === 422) {
      setErrors(response.data.errors);
    }
  };

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (field, value) => {
    setPetowner({ ...petowner, [field]: value });
  };

  const steps = ["Register Pet Owner", "Create a User Account"];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box
            sx={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              "& > :not(style)": { m: 1 },
              margin: "auto",
            }}
          >
            <Typography variant="h4" >Pet Owner Registration</Typography>

            <TextField
              variant="outlined"
              id="firstname"
              label="Firstname"
              // helperText="Please enter your firstname"
              value={petowner.firstname}
              onChange={(ev) =>
                setPetowner({ ...petowner, firstname: ev.target.value })
              }
            />
            <TextField
              variant="outlined"
              id="Lastname"
              label="Lastname"
              // helperText="Please enter your firstname"
              value={petowner.lastname}
              onChange={(ev) =>
                setPetowner({ ...petowner, lastname: ev.target.value })
              }
            />
            <TextField
              variant="outlined"
              id="Contact Number"
              label="Contact Number"
              type="number"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              +63
            </InputAdornment>
          ),
        }}
              value={petowner.contact_num}
              onChange={(ev) => { 
                const input = ev.target.value.slice(0, 10);
                // const input = ev.target.value.replace(/\D/g, '').slice(0, 10);
                setPetowner({ ...petowner, contact_num: input });
              }}
            />

            <TextField
              id="Zone"
              label="Zone"
              value={petowner.zone}
              onChange={(ev) =>
                setPetowner({ ...petowner, zone: ev.target.value })
              }
            />
            <TextField
              id="Barangay"
              label="Barangay"
              value={petowner.barangay}
              onChange={(ev) =>
                setPetowner({ ...petowner, barangay: ev.target.value })
              }
            />

            <Autocomplete
              sx={{ width: "100%" }}
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
            />
          </Box>
        );
      case 1:
        return (
          // <h2>Create An Acount</h2>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              "& > :not(style)": { m: 2 },
            }}
          >
            <Typography variant="h4">Create an Account</Typography>
            <FormControl sx={{ m: 1, minWidth: 120 }} >
              <InputLabel id="demo-select-small-label">Role</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="Role"
                value={petowner.role_id || 3}
                onChange={(ev) =>
                  setPetowner({ ...petowner, role_id: ev.target.value })
                }
                disabled
              >
                {roles.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              id="Username"
              label="Username"
              value={petowner.username}
              onChange={(ev) =>
                setPetowner({ ...petowner, username: ev.target.value })
              }
            />
            <TextField
              id="Email"
              label="Email"
              type="email"
              value={petowner.email}
              onChange={(ev) =>
                setPetowner({ ...petowner, email: ev.target.value })
              }
            />
             <TextField
                  variant="outlined"
                  id="Password"
                  label="Password"
                  type="password"
                  value={petowner.password}
                  onChange={(ev) =>
                    setPetowner({ ...petowner, password: ev.target.value })
                  }
                />
                <TextField
                  variant="outlined"
                  id="Password Confirmation"
                  label="Password Confirmation"
                  type="password"
                  value={petowner.password_confirmation}
                  onChange={(ev) =>
                    setPetowner({ ...petowner, password_confirmation: ev.target.value })
                  }
                />
          </Box>
        );
      default:
        return "Unknown step";
    }
  };
  //   console.log(petowner);

  return (
    <div>
      {errors && (
        <Box p={2}>
          {Object.keys(errors).map((key) => (
            <Alert severity="error" key={key}>{errors[key][0]}</Alert>
          ))}
        </Box>
      )}

      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <p>All steps completed</p>
          </div>
        ) : (
          <div>
            {getStepContent(activeStep)}
            <div>
              <Button disabled={activeStep === 0} onClick={handlePrev}>
                Back
              </Button>
              {activeStep === 0 && (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
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
                    onClick={onSubmit}
                  >
                    Finish
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
