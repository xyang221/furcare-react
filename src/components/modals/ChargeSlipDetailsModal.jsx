import React, { useEffect, useState } from "react";
import {
  Button,
  Backdrop,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  DialogActions,
} from "@mui/material";
import { Close, Print } from "@mui/icons-material";

export default function ChargeSlipDetailsModal(props) {
  const {
    open,
    onClose,
    petowner,
    clientservice,
    servicesavailed,
    calculateTotal,
    loading,
    printPDF,
  } = props;

  const columns = [
    { id: "Pet", name: "Pet" },
    { id: "Service", name: "Service" },
    { id: "Quantity", name: "Quantity" },
    { id: "Unit", name: "Unit" },
    { id: "Unit Price", name: "Unit Price" },
  ];

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            <Button
              variant="contained"
              size="small"
              color="success"
              onClick={printPDF}
            >
              <Print fontSize="small" />
              <Typography variant="body1"> Print</Typography>
            </Button>
            <IconButton onClick={onClose} style={{ float: "right" }}>
              <Close color="primary"></Close>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography align="center" variant="h5">
              Charge Slip{" "}
            </Typography>
            <Box
              p={1}
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography variant="subtitle">
                Client: {petowner.firstname} {petowner.lastname}
              </Typography>
              <Typography variant="subtitle">
                Date: {clientservice.date}
              </Typography>
            </Box>
            <TableContainer sx={{ height: 380 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.id}>{column.name}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {servicesavailed.map((item) => (
                    <TableRow hover role="checkbox" key={item.id}>
                      <TableCell>{item.pet.name} </TableCell>
                      <TableCell>{item.service.service}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{item.unit_price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} align="right">
                      Total:
                    </TableCell>
                    <TableCell>{calculateTotal}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4} align="right">
                      Deposit:
                    </TableCell>
                    <TableCell>{clientservice.deposit}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4} align="right">
                      Balance:
                    </TableCell>
                    <TableCell>{clientservice.balance}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      )}
    </>
  );
}
