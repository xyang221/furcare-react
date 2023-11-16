import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import {
  Button,
  Checkbox,
  Alert,
  Backdrop,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  DialogActions,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export default function AddService(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    title,
    errors,
  } = props;

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999 }}></Backdrop>
      {!loading && (
       <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
       <DialogTitle>
        {title}
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
        Are you sure you have availed the {title}?
       </DialogContent>

       <DialogActions>
         <Button variant="contained" 
         color="success"                
         onClick={onSubmit}
>
           Yes
         </Button>
       </DialogActions>
     </Dialog>
      )}
    </>
  );
}
