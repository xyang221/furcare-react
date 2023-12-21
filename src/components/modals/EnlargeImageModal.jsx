import React from "react";
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export default function EnlargeImageModal(props) {
  const { open, onClose, image, title, errors } = props;

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {title}
          <IconButton onClick={onClose} style={{ float: "right" }}>
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

          <img
            style={{
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            src={`http://localhost:8000/` + image}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
