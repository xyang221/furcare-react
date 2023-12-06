import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
  InputAdornment,
  Paper,
} from "@mui/material";

export default function StaffForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();

  const [address, setAddress] = useState([]);
  const [value, setValue] = useState(null);

  const [staff, setStaff] = useState({
    id: null,
    firstname: "",
    lastname: "",
    contact_num: "",
    zipcode_id: null,
    barangay: "",
    zone: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const onSubmit = (ev) => {
    ev.preventDefault();

    axiosClient
      .post(`/staffs`, staff)
      .then((response) => {
        setNotification("Staff successfully created");
        const createdStaffId = response.data.id;
        navigate(`/admin/staffs/${createdStaffId}/view`);
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
      .catch(() => {
      });
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

  const steps = ["Register Staff", "Create an Account"];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box
            sx={{
              width: "70%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              "& > :not(style)": { m: 1 },
              margin: "auto",
            }}
          >
            <Typography variant="h5" padding={1}>
              Staff Registration
            </Typography>

            <TextField
              variant="outlined"
              id="firstname"
              label="Firstname"
              size="small"
              value={staff.firstname}
              onChange={(ev) =>
                setStaff({ ...staff, firstname: ev.target.value })
              }
              fullWidth
              required
            />
            <TextField
              variant="outlined"
              id="Lastname"
              label="Lastname"
              size="small"
              value={staff.lastname}
              onChange={(ev) =>
                setStaff({ ...staff, lastname: ev.target.value })
              }
              fullWidth
              required
            />
            <TextField
              variant="outlined"
              id="Contact Number"
              label="Contact Number"
              size="small"
              type="number"
              inputProps={{
                minLength: 10,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+63</InputAdornment>
                ),
              }}
              value={staff.contact_num}
              onChange={(ev) => {
                const input = ev.target.value.slice(0, 10);
                setStaff({ ...staff, contact_num: input });
              }}
              fullWidth
              required
            />
            <TextField
              id="Zone"
              label="Zone/Block/Street"
              size="small"
              value={staff.zone}
              onChange={(ev) => setStaff({ ...staff, zone: ev.target.value })}
              fullWidth
              required
            />
            <TextField
              id="Barangay"
              label="Barangay"
              size="small"
              value={staff.barangay}
              onChange={(ev) =>
                setStaff({ ...staff, barangay: ev.target.value })
              }
              fullWidth
              required
            />

            <Autocomplete
              size="small"
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
                setStaff({
                  ...staff,
                  zipcode_id: newValue ? newValue.id : null,
                });
              }}
              value={value}
              fullWidth
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
              alignItems: "center",
              "& > :not(style)": { m: 1 },
              margin: "auto",
            }}
          >
            <Typography variant="h5" padding={1}>
              Create an Account
            </Typography>

            <TextField
              id="Username"
              label="Username"
              size="small"
              value={staff.username}
              onChange={(ev) =>
                setStaff({ ...staff, username: ev.target.value })
              }
              fullWidth
              required
            />
            <TextField
              id="Email"
              label="Email"
              size="small"
              type="email"
              value={staff.email}
              onChange={(ev) => setStaff({ ...staff, email: ev.target.value })}
              fullWidth
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
              value={staff.password}
              onChange={(ev) =>
                setStaff({ ...staff, password: ev.target.value })
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
              value={staff.password_confirmation}
              onChange={(ev) =>
                setStaff({
                  ...staff,
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
        marginTop: "3%",
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
        <div className="alert">
          {Object.keys(errors).map((key) => (
            <p key={key}>{errors[key][0]}</p>
          ))}
        </div>
      )}
      <div>
        {activeStep === steps.length ? (
          <div>
            <p>All steps completed</p>
          </div>
        ) : (
          <div>
            <form
              onSubmit={(e) => handleNext(e)}
              style={{ alignItems: "center" }}
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
