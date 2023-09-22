import React, { useState, useEffect } from "react";

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

export default function Password({value,onChange,label}) {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
   
        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
          <InputLabel htmlFor="standard-adornment-password">{label}</InputLabel>
          <Input
            // id="standard-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                </IconButton>
              </InputAdornment>
            }
            value={value}
            onChange={onChange}
          />
        </FormControl>
    
     
  );
}
