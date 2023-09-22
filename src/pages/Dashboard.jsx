import React, { useState, useEffect } from "react";
import { SearchBar } from "../components/SearchBar";
import { SearchResult } from "../components/SearchResults";
import { SearchResultsList } from "../components/SearchResultsList";

import Title from "../components/Title";

import StepperForm from "../components/StepperForm";
import {
  TextField,
  Box,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Input,
  FormControl,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Dashboard() {
  const [results, setResults] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <div>
        <Title props={"Dashboard"} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            "& > :not(style)": { m: 5 },
          }}
        >
          <TextField
            id="firstname"
            label="Firstname"
            size="small"
            // helperText="Please enter your firstname"
            value={results}
            onChange={(event) => {
              setResults(event.target.value);
            }}
          />
          <TextField
            id="lastname"
            label="Lastname"
            size="small"
            value={results}
            onChange={(event) => {
              setResults(event.target.value);
            }}
          />
        </Box>

        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
          <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
          <Input
            id="standard-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        {/* <SearchBar setResults={setResults} /> */}
        {/* {results && results.length > 0 && (
          <SearchResultsList results={results} />
        )} */}
        {/* <StepperForm/> */}
      </div>
    </div>
  );
}
