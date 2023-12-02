import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
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
import ReactToPrint from "react-to-print";
import { useRef } from "react";

const ChargeSlipPrint = React.forwardRef((props, ref) => {
  const { id } = useParams();
  //for table
  const columns = [
    { id: "Pet", name: "Pet" },
    { id: "Service", name: "Service" },
    { id: "Quantity", name: "Quantity" },
    { id: "Unit", name: "Unit" },
    { id: "Unit Price", name: "Unit Price" },
  ];

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());

  const [servicesavailedpaid, setServicesavailedpaid] = useState([]);
  const [petowner, setPetowner] = useState([]);
  const [clientservice, setClientservice] = useState([]);

  const getServicesAvailedChargeSlip = () => {
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/servicesavailed/petowner/${id}/completed`)
      .then(({ data }) => {
        setLoading(false);
        setServicesavailedpaid(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const getClientService = () => {
    setMessage(null);
    axiosClient
      .get(`/clientservices/petowner/${id}`)
      .then(({ data }) => {
        setClientservice(data);
        setPetowner(data.petowner);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
      });
  };

  // Group services by pet
  const groupServicesByPet = () => {
    const groupedServices = {};
    servicesavailedpaid.forEach((item) => {
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

  // Calculate the total for all selected items
  const calculateTotal = () => {
    return servicesavailedpaid.reduce((total, item) => {
      return total + parseFloat(item.unit_price);
    }, 0);
  };

  useEffect(() => {
    getClientService();
    getServicesAvailedChargeSlip();
  }, []);

  return (
    <div ref={ref}>
      <Paper
        sx={{
          width: "550px",
          padding: "10px",
        }}
      >
        <Typography align="center" variant="h5">
          Charge Slip{" "}
        </Typography>{" "}
        <Box
          p={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Typography variant="subtitle">
            Client: {petowner.firstname} {petowner.lastname}
          </Typography>
          <Typography variant="subtitle">
            Date: {date.toDateString()}{" "}
          </Typography>
        </Box>
        <TableContainer >
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
                      <TableCell colSpan={5}>
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
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    Total:
                  </TableCell>
                  <TableCell>{calculateTotal()}</TableCell>
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
                  <TableCell sx={{ width: "30%" }}>
                    {calculateTotal() - clientservice.deposit}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    Cash:
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    Change:
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
});

const PrintComponent = () => {
  const componentRef = useRef();
  const pageStyle = `{ size: 2in 4in }`;

  return (
    <>
      <div>
        {/* button to trigger printing of target component */}
        <ReactToPrint
          pageStyle={pageStyle}
          trigger={() => <Button variant="contained">print</Button>}
          content={() => componentRef.current} // Use componentRef.current here
        />

        {/* component to be printed */}
        <ChargeSlipPrint ref={componentRef} />
      </div>
    </>
  );
};

export default PrintComponent;
