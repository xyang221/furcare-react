import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import Swal from "sweetalert2";

export default function GenerateBilling() {
  const { id } = useParams();

  //for table
  const columns = [
    { id: "Pet", name: "Pet" },
    { id: "Service", name: "Service" },
    { id: "Quantity", name: "Quantity" },
    { id: "Unit", name: "Unit" },
    { id: "Unit Price", name: "Unit Price" },
    { id: "Total", name: "Total" },
  ];

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [servicesavailed, setServicesavailed] = useState([]);
  const [clientservice, setClientservice] = useState([]);
  const [petowner, setPetowner] = useState([]);

  const [serviceAvailedPrices, setServiceAvailedPrices] = useState({});
  const [cash, setCash] = useState(null);

  const getServicesAvailed = () => {
    setCash(null);
    setMessage(null);
    setLoading(true);
    setServicesavailed([]);
    setServiceAvailedPrices({});
    setClientservice([]);
    axiosClient
      .get(`/servicesavailed/petowner/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setServicesavailed(data.data);
        data.data.forEach((item) =>
          updateServicePrice(item.id, item.unit_price)
        );
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
      .get(`/clientdeposits/petowner/${id}`)
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

  const updateServicePrice = (id, price) => {
    setServiceAvailedPrices((prevPrices) => ({
      ...prevPrices,
      [id]: price,
    }));
  };

  // Update the onChange function for the price TextField
  const handlePriceChange = (ev, id) => {
    const { value } = ev.target;
    updateServicePrice(id, value);
  };

  // Calculate the total for all selected items
  const calculateTotal = () => {
    return servicesavailed.reduce((total, item) => {
      const price = serviceAvailedPrices[item.id] || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const calculateBalance = () => {
    const totalCost = calculateTotal();
    const balance = totalCost - clientservice.deposit;
    if (balance === undefined || isNaN(balance)) {
      return 0;
    }
    if (cash > balance) {
      return 0;
    }
    return Math.max(balance, 0);
  };

  const handleCash = (ev, id) => {
    const { value } = ev.target;
    setCash(parseFloat(value));
  };

  const calculateChange = () => {
    if (
      cash === undefined ||
      isNaN(cash) ||
      calculateTotal() === undefined ||
      isNaN(calculateTotal()) ||
      clientservice === undefined ||
      clientservice.deposit === undefined ||
      isNaN(clientservice.deposit) ||
      clientservice.balance === undefined ||
      isNaN(clientservice.balance)
    ) {
      return 0;
    }
    if (calculateTotal() !== 0) {
      const change = cash - (calculateTotal() - clientservice.deposit);
      return change >= 0 ? change : 0;
    } else {
      return 0; 
    }
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();

    if (servicesavailed.length > 0) {
      try {
        const updatedServicesPromises = servicesavailed.map((item) => {
          return axiosClient.put(`/servicesavailed/${item.id}`, {
            ...item,
            unit_price: serviceAvailedPrices[item.id] || null,
          });
        });

        await Promise.all(updatedServicesPromises);

        if (clientservice) {
          // Calculate and update client's balance
          const updatedClientService = {
            ...clientservice,
            balance: calculateBalance() || 0,
          };

          await axiosClient.put(
            `/clientdeposits/${clientservice.id}`,
            updatedClientService
          );
          Swal.fire({
            title: "Success",
            icon: "success",
            confirmButtonText: "PRINT CHARGE SLIP",
            confirmButtonColor: "black",
          }).then((result) => {
            if (result.isConfirmed) {
              setCash(0);
              getServicesAvailed();
              windowOpenPDFforPrint();
            }
          });
        }
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: "No services availed!",
          icon: "error",
          confirmButtonColor: "black",
        });
      }
    } else {
      Swal.fire({
        title: "Error",
        text: "No services availed!",
        icon: "error",
        confirmButtonColor: "black",
      });
    }
  };

  const refresh = () => {
    getServicesAvailed();
    getClientService();
  };

  const windowOpenPDFforPrint = async () => {
    try {
      // Fetch PDF content
      const response = await axiosClient.get(
        `/clientservice/${clientservice.id}/generate-chargeslip`,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/pdf",
          },
        }
      );

      const pdfBlob = response.data;

      const url = window.URL.createObjectURL(new Blob([pdfBlob]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `ChargeSlip-${
          clientservice.date
        }-${`${petowner.firstname}_${petowner.lastname}`}-.pdf`
      );
      document.body.appendChild(link);

      // Trigger the download
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Error fetching PDF:", error);
    }
  };

  return (
    <>
      <Paper
        sx={{
          width: "650px",
          padding: "5px",
          margin: "auto",
        }}
      >
        <Typography align="center" variant="h5">
          Charge Slip{" "}
          <IconButton onClick={refresh} variant="contained" color="success">
            <Refresh />
          </IconButton>
        </Typography>{" "}
        <Box
          p={1}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Typography variant="subtitle">
            Client: {petowner.firstname} {petowner.lastname}
          </Typography>
          <Typography variant="subtitle">Date: {clientservice.date}</Typography>
        </Box>
        <TableContainer sx={{ height: 380 }}>
          <form onSubmit={(ev) => onSubmit(ev)}>
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
                    <TableCell
                      colSpan={6}
                      style={{ textAlign: "center", color: "red" }}
                    >
                      {message}
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
              {!loading && (
                <TableBody>
                  {servicesavailed.map((item) => (
                    <TableRow hover role="checkbox" key={item.id}>
                      <TableCell>{item.pet.name} </TableCell>
                      <TableCell>{item.service.service}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell sx={{ width: "30%" }}>
                        <TextField
                          key={item.id}
                          size="small"
                          type="number"
                          value={serviceAvailedPrices[item.id] || ""}
                          onChange={(ev) => handlePriceChange(ev, item.id)}
                          required
                        />
                      </TableCell>
                      <TableCell>
                        {item.quantity * (serviceAvailedPrices[item.id] || 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={5} align="right">
                      Total:
                    </TableCell>
                    <TableCell>{calculateTotal()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5} align="right">
                      Deposit:
                    </TableCell>
                    <TableCell>
                      {calculateTotal() === 0 ? 0 : clientservice.deposit}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5} align="right">
                      Balance:
                    </TableCell>
                    <TableCell sx={{ width: "30%" }}>
                      {calculateBalance()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5} align="right">
                      Cash:
                    </TableCell>
                    <TableCell sx={{ width: "30%" }}>
                      <TextField
                        size="small"
                        type="number"
                        onChange={(ev) => handleCash(ev)}
                        value={cash || ""}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5} align="right">
                      Change:
                    </TableCell>
                    <TableCell>{calculateChange()}</TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ marginTop: "10px" }}
            >
              Pay
            </Button>
          </form>
        </TableContainer>
      </Paper>
    </>
  );
}
