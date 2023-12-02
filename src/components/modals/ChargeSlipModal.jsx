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
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Close, Refresh, Remove } from "@mui/icons-material";
import { useRef } from "react";
import ReactToPrint from "react-to-print";

class ChargeSlipModal extends React.Component {
  render(props) {
  const {
    open,
    onClose,
    loading,
    servicesavailed,
    getServicesAvailed,
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
  ];

  const [date, setDate] = useState(new Date());

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


  useEffect(() => {
  }, []);

  return (
    <>
        <Box
          p={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          
        >
          <Typography variant="h6">
            Client:dsd {petowner.firstname} {petowner.lastname}
          </Typography>
          <Typography variant="h6">Date: {date.toDateString()} </Typography>
        </Box>
        <Box display="flex" flexDirection="row">
        
       
        </Box>
       
        <div>
        <table stickyHeader aria-label="sticky table">
          <th>
            <tr>
              {columns.map((column) => (
                <td key={column.id}>{column.name}</td>
              ))}
            </tr>
          </th>
          {loading && (
            <tb>
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            </tb>
          )}
            {!loading && message && (
              <tb>
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    {message}
                  </td>
                </tr>
              </tb>
            )}

          {!loading && (
            <tb>
              {Object.keys(servicesGroupedByPet).map((petId) => (
                <React.Fragment key={petId}>
                  <tr>
                    <td colSpan={5}>
                      <Typography variant="subtitle1">
                          {servicesGroupedByPet[petId][0].pet.name}
                      </Typography>
                    </td>
                  </tr>
                  {servicesGroupedByPet[petId].map((item) => (
                    <tr hover role="checkbox" key={item.id}>
                      <td>{item.service.service}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unit}</td>
                      <td>{item.unit_price}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
              <tr>
                <td colSpan={4} align="right">
                  Total:
                </td>
                <td>{calculateTotal()}</td>
              </tr>
               
            </tb>
          )}
          <Button
            variant="contained"
            size="small"
            // onClick={onSubmit}
          >
            <Typography>Pay</Typography>
          </Button>
        </table>
      
      </div>
   
    </>
  );
}
}

export default function PrintComponent(props) {
  let componentRef = useRef();

  const {
    open,
    onClose,
    loading,
    servicesavailed,
    getServicesAvailed,
    petowner,
    message,
  } = props;

  return (
    <>
      <div>
        {/* button to trigger printing of target component */}
        <ReactToPrint
         bodyClass="print-agreement"
          trigger={() => <button>Print this out!</button>}
          content={() => componentRef}
        />
  <Paper
        sx={{
          width:"550px",
          padding: "10px",
        }}
      >
     
        {/* component to be printed */}
        <ChargeSlipModal ref={(el) => (componentRef = el)}
        />
       
        </Paper>
      </div>
    </>
  );
}
