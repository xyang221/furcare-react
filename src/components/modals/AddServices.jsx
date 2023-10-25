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
  MenuItem,
  Select,
  Stack,
  TextField,
  DialogActions,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export default function AddServices(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    services,
    checkedItems,
    setCheckedItems,
    errors,
  } = props;

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999 }}></Backdrop>
      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            Services
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
              <TableContainer  sx={{ height: 380 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow >
                      <TableCell style={{ backgroundColor: "black", color: "white" }}> </TableCell>
                      <TableCell style={{ backgroundColor: "black", color: "white" }}>ID</TableCell>
                      <TableCell style={{ backgroundColor: "black", color: "white" }}>Category</TableCell>
                      <TableCell style={{ backgroundColor: "black", color: "white" }}>Name</TableCell>
                      <TableCell style={{ backgroundColor: "black", color: "white" }}>Price</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {services.map((item) => (
                      <TableRow hover role="checkbox" key={item.id}>
                        <Checkbox
                          checked={checkedItems[item.id]}
                          onChange={() => {
                            setCheckedItems((prevCheckedItems) => ({
                              ...prevCheckedItems,
                              [item.id]: !prevCheckedItems[item.id],
                            }));
                          }}
                        />
                        <TableCell> {item.id}</TableCell>
                        <TableCell> {item.category.category} </TableCell>
                        <TableCell> {item.service} </TableCell>
                        <TableCell> {item.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button variant="contained" onClick={onSubmit}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
