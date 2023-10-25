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
import AddServices from "../components/modals/AddServices";
import { Close, Remove } from "@mui/icons-material";

export default function Receipt() {
  const { id } = useParams();
  const navigate = useNavigate()
  //for table
  const columns = [
    { id: "ID", name: "ID" },
    { id: "Service", name: "Service" },
    { id: "Price", name: "Price" },
    { id: "Quantity", name: "Quantity" },
    { id: "Unit", name: "Unit" },
    { id: "Total", name: "Total" },
    { id: "sdsds", name: "" },
  ];

  const [notification, setNotification] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [reciept, setReceipt] = useState([]);

  const getServicesAvailed = () => {
    setLoading(true);
    axiosClient
      .get(`/servicesavailed/${id}/add `)
      .then(({ data }) => {
        setLoading(false);
        setReceipt(data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const [petowner, setPetowner] = useState([]);

  const getPetowner = () => {
    setModalloading(true);
    axiosClient
      .get(`/petowners/${id}`)
      .then(({ data }) => {
        setModalloading(false);
        setPetowner(data);
      })
      .catch(() => {
        setModalloading(false);
      });
  };

  const [checkedItems, setCheckedItems] = useState({});
  const [services, setServices] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [units, setUnits] = useState({});

  const getServices = () => {
    setLoading(true);
    axiosClient
      .get(`/services`)
      .then(({ data }) => {
        setLoading(false);
        setServices(data.data);

        // Initialize the checkedItems state with default values
        const defaultChecked = {};
        data.data.forEach((item) => {
          defaultChecked[item.id] = false;
        });

        setCheckedItems(defaultChecked);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handleShowSelected = () => {
    const selected = services.filter((item) => checkedItems[item.id]);
    setSelectedItems(selected);
    openchange(false);
  };

  // Handle changes in quantity and unit input fields
  const handleQuantityChange = (itemId, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: quantity,
    }));
  };

  const handleUnitChange = (itemId, unit) => {
    setUnits((prevUnits) => ({
      ...prevUnits,
      [itemId]: unit,
    }));
  };

  const handleRemoveItem = (itemId) => {
    // Create a new array without the item to be removed
    setCheckedItems((prevCheckedItems) => {
      const updatedCheckedItems = { ...prevCheckedItems };
      delete updatedCheckedItems[itemId];
      return updatedCheckedItems;
    });

    // Create a new array without the item to be removed
  const updatedSelectedItems = selectedItems.filter((item) => item.id !== itemId);
  setSelectedItems(updatedSelectedItems);
    
      // Also, remove the quantity and unit associated with the removed item
  setQuantities((prevQuantities) => {
    const { [itemId]: removed, ...restQuantities } = prevQuantities;
    return restQuantities;
  });

  setUnits((prevUnits) => {
    const { [itemId]: removed, ...restUnits } = prevUnits;
    return restUnits;
  });
  };

   // Calculate the total for all selected items
   const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      const quantity = quantities[item.id] || 0;
      return total + item.price * quantity;
    }, 0);
  };

  //for modal
  const [errors, setErrors] = useState(null);
  const [modalloading, setModalloading] = useState(false);
  const [appointment, setAppointment] = useState({
    id: null,
    date: "",
    purpose: "",
    remarks: "",
    petowner_id: null,
    service_id: null,
  });
  const [open, openchange] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const addModal = (ev) => {
    // setOpenAdd(true);
    setAppointment({});
    setErrors(null);
    openchange(true);
  };

  const closepopup = () => {
    openchange(false);
    setOpenAdd(false);
  };


  const onSubmit = () => {
    if (appointment.id) {
      axiosClient
        .put(`/appointments/${appointment.id}`, appointment)
        .then(() => {
          setNotification("Appointment was successfully updated");
          openchange(false);
          getServicesAvailed();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/appointments`, appointment)
        .then(() => {
          setNotification("Appointment was successfully created");
          openchange(false);
          getServicesAvailed();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    getPetowner();
    getServices();
    // getServicesAvailed();
  }, []);

  return (
    <>
      <Paper
        sx={{
          minWidth: "50%",
          padding: "10px",
          margin: "10px",
        }}
      >
        <Typography variant="h4">Charge Slip</Typography>{" "}
        <Box
          p={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Typography variant="h6">
            Client: {petowner.firstname} {petowner.lastname}{" "}
          </Typography>
          <Typography variant="h6">Date: {date.toDateString()} </Typography>
        </Box>
        <Box display="flex" flexDirection="row">
          <Button
            variant="contained"
            size="small"
            color="success"
            onClick={addModal}
          >
            <Typography>add service</Typography>
          </Button>
          <Button
            variant="contained"
            size="small"
            color="success"
            // onClick={() => onEdit(r)}
          >
            <Typography>add product</Typography>
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={() => navigate(-1)}
          >
            <Typography>back</Typography>
          </Button>
        </Box>
        <AddServices
          open={open}
          onClose={closepopup}
          onClick={closepopup}
          onSubmit={handleShowSelected}
          loading={loading}
          services={services}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          errors={errors}
        />
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
                  <TableCell colSpan={7} style={{ textAlign: "center" }}>
                    Loading...
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {!loading && (
              <TableBody>
                {selectedItems.map((item) => (
                  <TableRow hover role="checkbox" key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.service}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>
                      {" "}
                      <TextField
                        placeholder="Quantity"
                        size="small"
                        sx={{ width: "90%" }}
                        value={quantities[item.id] || ""}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        placeholder="Unit"
                        size="small"
                        minWidth="50%"
                        sx={{ width: "90%" }}
                        value={units[item.id] || ""}
                        onChange={(e) =>
                          handleUnitChange(item.id, e.target.value)
                        }
                      />{" "}
                    </TableCell>
                    <TableCell> </TableCell>
                    <TableCell>
                      {item.price * (quantities[item.id] || 0)}
                    </TableCell>
                    <TableCell>
              <IconButton
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleRemoveItem(item.id)}
                >
                <Close/>
              </IconButton>
            </TableCell>
                  </TableRow>
                ))}
                   <TableRow>
            <TableCell colSpan={6} align="right">
              Total:
            </TableCell>
            <TableCell>{calculateTotal()}</TableCell>
          </TableRow>
              </TableBody>
            )}
          </Table>
          
        </TableContainer>
        <Button
            variant="contained"
            size="small"
            onClick={addModal}
          >
            <Typography>Payment</Typography>
          </Button>
      </Paper>
    </>
  );
}
