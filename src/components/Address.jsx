import React, { useState, useEffect } from 'react';
import { Stack, Autocomplete, TextField, Box } from '@mui/material';
import axiosClient from '../axios-client';

export default function Address({ val }) {
  const [address, setAddress] = useState([]);
  const [value, setValue] = useState(""); // Initialize 'value' with the 'val' prop
  const [errors, setErrors] = useState(null);

  const getZipcodes = () => {
    axiosClient.get('/zipcodes')
      .then(({ data }) => {
        setAddress(data.data);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  useEffect(() => {
    getZipcodes();
  }, []);

  const handleValueChange = (event, newValue) => {
    setValue(newValue);
  
  };

  console.log(value);

  return (
    <div>
      <Stack sx={{ width: 300 }} spacing={5}>
        <Autocomplete
          getOptionLabel={(address) => `${address.area}, ${address.province}`}
          options={address}
          isOptionEqualToValue={(option, value) => option.area === value.area}
          noOptionsText="Not Available"
          renderOption={(props, address) => (
            <Box component="li" {...props} key={address.id}>
              {address.area}, {address.province}
            </Box>
          )}
          renderInput={(params) => <TextField {...params} label="Address" />}
          onChange={handleValueChange}
          value={val}
        />
      </Stack>
    </div>
  );
}
