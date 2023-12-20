import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
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
import { useRef } from "react";

export default function GenerateBilling() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const [servicesavailed, setServicesavailed] = useState([]);
  const [clientservice, setClientservice] = useState([]);
  const [servicesavailedpaid, setServicesavailedpaid] = useState([]);
  const [petowner, setPetowner] = useState([]);

  const [serviceAvailedPrices, setServiceAvailedPrices] = useState({});
  const [cash, setCash] = useState(null);

  const getServicesAvailed = () => {
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/servicesavailed/petowner/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setServicesavailed(data.data);
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
      const price = serviceAvailedPrices[item.id] || 0; // Fetch price from state
      return total + price * item.quantity;
    }, 0);
  };

  const calculateBalance = () => {
    const totalCost = calculateTotal();
    const balance = totalCost - clientservice.deposit;
    if (balance === undefined || isNaN(balance)) {
      return 0;
    }
    // const newBalance = calculateBalance();
    // setClientservice(prevState => ({
    //   ...prevState,
    //   balance: newBalance
    // }));
    return Math.max(balance, 0);
  };

  // const balance = calculateBalance()

  // Update the onChange function for the price TextField
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
      isNaN(clientservice.deposit)
    ) {
      return 0;
    }

    const change = cash - calculateBalance();
    return Math.max(change, 0); // Ensure the result stays at a minimum of 0
  };

  // // Group services by pet
  // const groupServicesByPet = () => {
  //   const groupedServices = {};
  //   servicesavailed.forEach((item) => {
  //     const petId = item.pet.id;
  //     if (groupedServices.hasOwnProperty(petId)) {
  //       groupedServices[petId].push(item);
  //     } else {
  //       groupedServices[petId] = [item];
  //     }
  //   });
  //   return groupedServices;
  // };

  // const servicesGroupedByPet = groupServicesByPet();

  const onSubmit = async () => {
    try {
      const updatedServicesPromises = servicesavailed.map((item) => {
        return axiosClient.put(`/servicesavailed/${item.id}`, {
          ...item,
          unit_price: serviceAvailedPrices[item.id] || null,
        });
      });

      const updateServicesResults = await Promise.all(updatedServicesPromises);

      await axiosClient.put(`/clientservices/${clientservice.id}`, {
        ...clientservice,
        balance: calculateBalance() || null,
      });

      getServicesAvailed(); // Assuming this is a function defined elsewhere
      navigate(`/admin/${id}/chargeslip`);
      // servicesGroupedByPet(null);
      getServicesAvailedChargeSlip(); // Assuming this is a function defined elsewhere
    } catch (err) {
      if (err.response && err.response.status === 422) {
        console.log(err.response.data.errors);
      } else {
        console.log(err.response.data.message);
      }
    }
  };

  const refresh = () => {
    getServicesAvailed();
    getClientService();
  };

  useEffect(() => {}, []);

  return (
    <>
      <Paper
        sx={{
          width: "550px",
          padding: "10px",
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
                {/* {Object.keys(servicesGroupedByPet).map((petId) => (
                  <React.Fragment key={petId}>
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Typography variant="subtitle1">
                          {servicesGroupedByPet[petId][0].pet.name}
                        </Typography>
                      </TableCell>
                    </TableRow> */}
                {servicesavailed.map((item) => (
                  <TableRow hover role="checkbox" key={item.id}>
                    <TableCell>{item.pet.name} </TableCell>
                    <TableCell>{item.service.service}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell sx={{ width: "50%" }}>
                      <TextField
                        size="small"
                        type="number"
                        // value={
                        //   item.unit_price === null
                        //     ? serviceAvailedPrices[item.id]
                        //     : item.unit_price
                        // }
                        value={serviceAvailedPrices[item.id]}
                        onChange={(ev) => handlePriceChange(ev, item.id)}
                        required
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {/* </React.Fragment> */}
                {/* ))} */}
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
                  <TableCell>
                    {calculateTotal() === 0 ? 0 : clientservice.deposit}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    Balance:
                  </TableCell>
                  <TableCell sx={{ width: "30%" }}>
                    {calculateBalance()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} align="right">
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
                  <TableCell colSpan={4} align="right">
                    Change:
                  </TableCell>
                  <TableCell>{calculateChange()}</TableCell>
                </TableRow>
              </TableBody>
            )}
            <Button variant="contained" size="small" onClick={onSubmit}>
              <Typography>Generate</Typography>
            </Button>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
