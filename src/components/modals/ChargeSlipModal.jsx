import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Close, Refresh, Remove } from "@mui/icons-material";

export default function ChargeSlipModal(props) {

  const {
    open,
    onClose,
    loading,
    servicesavailed,
    // getServicesAvailed,
    petowner,
    message,
  } = props;

  //for table
  const columns = [
    { id: "Pet", name: "Pet" },
    { id: "Service", name: "Service" },
    { id: "Quantity", name: "Quantity" },
    { id: "Unit", name: "Unit" },
    { id: "Unit Price", name: "Unit Price" },
    { id: "Total", name: "Total" },
  ];

  // Calculate the total for all selected items
  const calculateTotal = () => {
    return servicesavailed.reduce((total, item) => {
      const price = servicesavailed.unit_price || 0; // Fetch price from state
      return total + price * item.quantity;
    }, 0);
  };

   // Group services by pet
   const groupServicesByPet = () => {
    const groupedServices = {};
    servicesavailed.forEach((item) => {
      const petId = item.pet.id;
      if (groupedServices.hasOwnProperty(petId)) {
        groupedServices[petId].push(item);
      } else {
        groupedServices[petId] = [item];
      }
    });
    return groupedServices;
  };

  const servicesGroupedByPet = groupServicesByPet();

  const [date, setDate] = useState(new Date());

  useEffect(() => {
  }, []);

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999 }}>
      <CircularProgress color="inherit" />
      </Backdrop>
      <Paper
        sx={{
          width:"550px",
          padding: "10px",
        }}
      >
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Charge Slip <IconButton
          // onClick={()=>getServicesAvailed()}
          variant="contained"
          color="success"
        >
            <Refresh/>
        </IconButton>
          <IconButton onClick={onClose} style={{ float: "right" }}>
            <Close color="primary"></Close>
          </IconButton>
        </DialogTitle>
        <DialogContent>
        <Box
          p={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          
        >
          <Typography variant="h6">
            Client: {petowner.firstname} {petowner.lastname}
          </Typography>
          <Typography variant="h6">Date: {date.toDateString()} </Typography>
        </Box>
        <Box display="flex" flexDirection="row">
        
       
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
          {loading && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center" }}>
                  Loading...
                </TableCell>
              </TableRow>
            </TableBody>
          )}
            {!loading && message && (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: "center" }}>
                    {message}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

          {!loading && (
            <TableBody>
              {Object.keys(servicesGroupedByPet).map((petId) => (
                <React.Fragment key={petId}>
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography variant="subtitle1">
                        {servicesGroupedByPet[petId][0].pet.name}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {servicesGroupedByPet[petId].map((item) => (
                    <TableRow hover role="checkbox" key={item.id}>
                        <TableCell> </TableCell>
                      <TableCell>{item.service.service}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{item.unit_price}</TableCell>
                      <TableCell>{item.unit_price}</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
              <TableRow>
                <TableCell colSpan={5} align="right">
                  Total:
                </TableCell>
                <TableCell>{calculateTotal()}</TableCell>
              </TableRow>
               
            </TableBody>
          )}
          <Button
            variant="contained"
            size="small"
            // onClick={onSubmit}
          >
            <Typography>Pay</Typography>
          </Button>
        </Table>
      
      </TableContainer>
      </DialogContent>
      </Dialog>
      </Paper>
    </>
  );
}
