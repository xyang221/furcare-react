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
import { Close } from "@mui/icons-material";

export default function UserEdit(props) {
  const {
    open,
    onClose,
    onClick,
    id,
    onSubmit,
    loading,
    roles,
    user,
    setUser, 
    errors,
    isUpdate,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    // Create a copy of the user object and update the specified field
    const updatedUser = { ...user, [fieldName]: value };
    // Update the user object with the updated value
    setUser(updatedUser);
  };

  return (
    <>
      {/* <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop> */}
      
      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {isUpdate ? "Update User" : "New User"}
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
          
               {isUpdate ? (
              
               <Select
                  label="Role"
                  value={user.role_id ||""}
                  onChange={(ev) => handleFieldChange("role_id", ev.target.value)}
                  disabled
                >
                  {roles.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.role}
                    </MenuItem>
                  ))}
                </Select>
                ) :
                (<Select
                  label="Role"
                  value={user.role_id || ""}
                  onChange={(ev) => handleFieldChange("role_id", ev.target.value)}
                >
                  {roles.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.role}
                    </MenuItem>
                  ))}
                </Select>)
                }

              <TextField
                variant="outlined"
                id="Username"
                label="Username"
                value={user.username}
                onChange={(ev) => handleFieldChange("username", ev.target.value)}
              />
              <TextField
                variant="outlined"
                id="Email"
                label="Email"
                type="email"
                value={user.email}
                onChange={(ev) => handleFieldChange("email", ev.target.value)}
              />
              <TextField
                variant="outlined"
                id="Password"
                label="Password"
                type="password"
                value={user.password || ''}
                onChange={(ev) => handleFieldChange("password", ev.target.value)}
              />
              <TextField
                variant="outlined"
                id="Password Confirmation"
                label="Password Confirmation"
                type="password"
                value={user.password_confirmation || ''}
                onChange={(ev) =>
                  handleFieldChange("password_confirmation", ev.target.value)
                }
              />
              <Button color="primary" variant="contained" onClick={onSubmit}>
                Save
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
