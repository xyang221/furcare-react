import React, { useEffect } from "react";
import {
  Button,
  Alert,
  Backdrop,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  DialogActions,
  Stack,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export default function LogoutModal(props) {
  const { open, onClose, onClick, onSubmit, loading, errors } = props;

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999 }}></Backdrop>
      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <Stack spacing={2} margin={2}>
            <DialogTitle>
              Logout
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
              Are you sure to logout?
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="success" onClick={onSubmit}>
                Yes
              </Button>
            </DialogActions>
          </Stack>
        </Dialog>
      )}
    </>
  );
}
