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
import ChargeSlipModal from "../../components/modals/ChargeSlipModal";

export default function GenerateBilling() {
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

  const [servicesavailed, setServicesavailed] = useState([]);
  const [servicesavailedpaid, setServicesavailedpaid] = useState([]);
  const [petowner, setPetowner] = useState([]);

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

  const getPetowner = () => {
    setLoading(true);
    axiosClient
      .get(`/petowners/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setPetowner(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const [serviceAvailedPrices, setServiceAvailedPrices] = useState({});

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

  const onSubmit = () => {
    const updatedServicesPromises = servicesavailed.map((item) => {
      return axiosClient.put(`/servicesavailed/${item.id}`, {
        ...item,
        unit_price: serviceAvailedPrices[item.id] || null,
      });
    });

    Promise.all(updatedServicesPromises)
      .then(() => {
        getServicesAvailed();
        servicesGroupedByPet(null);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          console.log(response.data.errors);
        }
      });
    openChargeSlip(true);
    getServicesAvailedChargeSlip()
  };

  const [date, setDate] = useState(new Date());

  //for modal
  const [open, openChargeSlip] = useState(false);
  const [errors, setErrors] = useState(null);

  const addModal = (ev) => {
    openChargeSlip(true);
    setErrors(null);
  };

  const closepopup = () => {
    openChargeSlip(false);
  };

  useEffect(() => {
    getPetowner();
  }, []);

  return (
    <>
      <Paper
        sx={{
          width: "550px",
          padding: "10px",
        }}
      >
        <Typography align="center" variant="h5">
          Charge Slip{" "}
          <IconButton
            onClick={() => getServicesAvailed()}
            variant="contained"
            color="success"
          >
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
          <Typography variant="subtitle">Date: {date.toDateString()} </Typography>
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
                        <TableCell sx={{width:"30%"}}>
                          <TextField
                            size="small"
                            type="number"
                            value={serviceAvailedPrices[item.id] || ""}
                            onChange={(ev) => handlePriceChange(ev, item.id)}
                          />
                        </TableCell>
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
                    Cash:
                  </TableCell>
                  <TableCell sx={{width:"30%"}}>
                          <TextField
                            size="small"
                            type="number"
                            // value={serviceAvailedPrices[item.id] || ""}
                            // onChange={(ev) => handlePriceChange(ev, item.id)}
                          />
                        </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    Change:
                  </TableCell>
                  <TableCell>
                          {/* <TextField
                            placeholder="pesos"
                            size="small"
                            type="number"
                            sx={{ width: "90%" }}
                            // value={serviceAvailedPrices[item.id] || ""}
                            // onChange={(ev) => handlePriceChange(ev, item.id)}
                          /> */}0
                        </TableCell>
                </TableRow>
              </TableBody>
            )}
            <Button variant="contained" size="small" onClick={onSubmit}>
              <Typography>Pay</Typography>
            </Button>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
