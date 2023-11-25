import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { Link, useParams } from "react-router-dom";
import { Close } from "@mui/icons-material";
import DiagnosisModal from "../components/modals/DiagnosisModal";
import AvailService from "../components/modals/AvailService";
import Receipt from "./Receipt";
import AddService from "../components/modals/AddService";
import VaccinationLogsModal from "../components/modals/VaccinationLogsModal";

export default function Services() {

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

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  const { id } = useParams();

  const [uniqueCategories, setUniqueCategories] = useState([]);

  const getServices = () => {
    setLoading(true);
    axiosClient
      .get("/services")
      .then(({ data }) => {
        setLoading(false);
        setServices(data.data);

        const uniqueCategoriesSet = new Set(
          data.data.map((service) => service.category.category)
        );
        const uniqueCategoriesArray = Array.from(uniqueCategoriesSet);

        setUniqueCategories(uniqueCategoriesArray);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const [pet, setPet] = useState([]);
  const [petowner, setPetowner] = useState({
    id: null,
    firstname: "",
    lastname: "",
    contact_num: "",
  });

  const getPet = () => {
    setNotification(null);
    setErrors(null);
    axiosClient
      .get(`/pets/${id}`)
      .then(({ data }) => {
        setPet(data);
        setPetowner(data.petowner)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  // console.log(pet.petowner.firstname)

  const [pets, setPets] = useState([]);

  const getPets = () => {
    axiosClient
      .get(`/pets`)
      .then(({ data }) => {
        setPets(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  //for modal
  const [errors, setErrors] = useState(null);
  const [modalloading, setModalloading] = useState(false);
  const [diagnosis, setDiagnosis] = useState({
    id: null,
    remarks: "",
    // pet_id: null,
    // service_id: null,
  });
  const [open, openchange] = useState(false);
  const [openConsultation, setOpenconsultation] = useState(false);
  const [homeservice, setHomeservice] = useState(false);
  const [boarding, setBoarding] = useState(false);
  const [opengrooming, setGrooming] = useState(false);
  const [openvaccination, setOpenVaccination] = useState(false);

  const [servicedata, setServicedata] = useState(null);

  const [vaccinationlog, setVaccinationlog] = useState({
    id: null,
    weight: "",
    description: "",
    administered: "",
    status: "",
    pet_id: null,
  });
  const [againsts, setAgainsts] = useState([]);

  const getAgainsts = () => {
    axiosClient
      .get(`/againsts`)
      .then(({ data }) => {
        setAgainsts(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  
  const addModal = (service) => {
    
    // getPet();
    setErrors(null);
    setServicedata(service);

    if (service.category.category == uniqueCategories[0]) {
      setOpenconsultation(true);
    } else if (service.category.category == uniqueCategories[1]) {
      setHomeservice(true);
    } else if (service.category.category == uniqueCategories[2]) {
      setBoarding(true);
    } else if (service.category.category == uniqueCategories[3]) {
      setGrooming(true);
    } else if (service.category.category == uniqueCategories[5]) {
      getAgainsts()
      getPets()
      setOpenVaccination(true);
    }
  };

  const closeservicemodal = () => {
    setOpenconsultation(false);
    setHomeservice(false)
    setBoarding(false);
    setGrooming(false);
    setOpenVaccination(false)
  };

  const onEdit = (r) => {
    setErrors(null);
    setModalloading(true);
    axiosClient
      .get(`/users/${r.id}`)
      .then(({ data }) => {
        setModalloading(false);
        setDiagnosis(data);
      })
      .catch(() => {
        setModalloading(false);
      });
    openchange(true);
  };

  const onArchive = (u) => {
    if (!window.confirm("Are you sure to archive this user?")) {
      return;
    }

    axiosClient.delete(`/users/${u.id}/archive`).then(() => {
      setNotification("User was archived");
    });
  };

  const handleDiagnosis = () => {
    if (diagnosis.id) {
      axiosClient
        .put(`/diagnosis/${diagnosis.id}`, diagnosis)
        .then(() => {
          setNotification("diagnosis was successfully updated");
          setOpenconsultation(false);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/diagnosis/pet/${id}/service/${servicedata.id}`, diagnosis)
        .then(() => {
          setNotification("Diagnosis was successfully created");
          setSelectedItems([...selectedItems, servicedata]);
          setOpenconsultation(false);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };


  const handleVaccination = () => {
    if (vaccinationlog.id) {
      axiosClient
        .put(`/vaccinationlogs/${vaccinationlog.id}`, vaccinationlog)
        .then(() => {
          setNotification("vaccinationlog was successfully updated");
          setOpenVaccination(false);
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/vaccinationlogs/pet/${id}`, vaccinationlog)
        .then(() => {
          setNotification("vaccinationlog was successfully created");
          setSelectedItems([...selectedItems, servicedata]);
          setOpenVaccination(false);
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  //for receipt
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [units, setUnits] = useState({});

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
    const updatedSelectedItems = selectedItems.filter(
      (item) => item.id !== itemId
    );
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

  const addSelectedService = () => {
    setSelectedItems([...selectedItems, servicedata]);
    
    setHomeservice(false)
    setGrooming(false);
    setBoarding(false);

  };

  const [date, setDate] = useState(new Date());

  useEffect(() => {
    getServices();
    getPet();
  }, []);

  return (
    <>
      <Paper
        sx={{
          padding: "10px",
          margin: "10px",
        }}
      >
        <Box
          p={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Typography variant="h4">Services</Typography>{" "}
          
        </Box>

        
        {/* <Stack flexDirection="row">  */}
        <Box p={2} sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={4}
            // columns={{ xs: 4, sm: 4, md: 16 / 4, lg: 20 / 4 }}
          >
            {uniqueCategories.map((category, index) => (
              <Grid item key={index}>
                <Typography variant="h6">{category}</Typography>
                <Stack direction="column" spacing={4}>
                  {services
                    .filter((service) => service.category.category === category)
                    .map((service, serviceIndex) => (
                      <Button
                        key={serviceIndex}
                        onClick={() => addModal(service)}
                        variant="contained"
                        size="small"
                        sx={{ height: 70, width: 180 }}
                      >
                        <Typography>{service.service}</Typography>
                      </Button>
                    ))}
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>
        <DiagnosisModal
          open={openConsultation}
          onClose={closeservicemodal}
          onClick={closeservicemodal}
          onSubmit={handleDiagnosis}
          loading={loading}
          petname={pet.name}
          diagnosis={diagnosis}
          setDiagnosis={setDiagnosis}
          errors={errors}
        />
         <AddService
          open={homeservice}
          onClose={closeservicemodal}
          onClick={closeservicemodal}
          onSubmit={addSelectedService}
          loading={loading}
          title={"Home Service"}
          errors={errors}
        />
        <AddService
          open={boarding}
          onClose={closeservicemodal}
          onClick={closeservicemodal}
          onSubmit={addSelectedService}
          loading={loading}
          title={"Boarding Service"}
          errors={errors}
        />
        <AddService
          open={opengrooming}
          onClose={closeservicemodal}
          onClick={closeservicemodal}
          onSubmit={addSelectedService}
          loading={loading}
          title={"Grooming Service"}
          errors={errors}
        />
         <VaccinationLogsModal
          open={openvaccination}
          onClose={closeservicemodal}
          onClick={closeservicemodal}
          onSubmit={handleVaccination}
          loading={loading}
          pets={pets}
          petid={id}
          // vaccinationdesc={servicedata.service}
          againsts={againsts}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          vaccination={vaccinationlog}
          setVaccination={setVaccinationlog}
          errors={errors}
          isUpdate={vaccinationlog.id}
        />
        <Divider />
        <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              
              <Typography variant="h4">Charge Slip </Typography>

              <Typography variant="h6">
                Date: {date.toDateString()}{" "}
              </Typography>
            </Box>
            <Typography variant="h6"> Client: {`${petowner.firstname} ${petowner.lastname}`} </Typography>
            <Typography variant="h6"> Pet: {pet.name} </Typography>

        <TableContainer sx={{ height: 500 }}>
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

            {!loading && (
              <TableBody>
                {selectedItems.map((item) => (
                  <TableRow hover role="checkbox" key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.service}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>
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
                        sx={{ width: "90%" }}
                        value={units[item.id] || ""}
                        onChange={(e) =>
                          handleUnitChange(item.id, e.target.value)
                        }
                      />{" "}
                    </TableCell>
                    {/* <TableCell> </TableCell> */}
                    <TableCell>
                      {item.price * (quantities[item.id] || 0)}
                    </TableCell>
                    {/* <TableCell>
              <IconButton
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleRemoveItem(item.id)}
                >
                <Close/>
              </IconButton>
            </TableCell> */}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={5} align="right">
                    Total:
                  </TableCell>
                  <TableCell>{calculateTotal()}</TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
          <Button variant="contained" size="small" onClick={addModal}>
            <Typography>Generate</Typography>
          </Button>
        </TableContainer>
        {/* </Stack> */}
      </Paper>
    </>
  );
}
