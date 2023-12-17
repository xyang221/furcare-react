import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
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
import {
  Add,
  Archive,
  Check,
  Close,
  Delete,
  Edit,
  Refresh,
  Save,
} from "@mui/icons-material";
import { useStateContext } from "../contexts/ContextProvider";

export default function PetMedicationAdmission({ tid }) {

  const {notification, setNotification} = useStateContext();
  //for table
  const columns = [
    // { id: "AM/PM", name: "AM/PM" },
    { id: "medicine", name: "medicine" },
    { id: "price", name: "price" },
    { id: "description", name: "description" },
    { id: "qty", name: "qty" },
    { id: "dosage", name: "dosage" },
    { id: "Actions", name: "Actions" },
  ];

  const [loading, setLoading] = useState(false);
  const [medications, setMedications] = useState([]);
  // const [notification, setNotification] = useState("");

  const getTreatmentPetMedication = () => {
    setLoading(true);
    axiosClient
      .get(`/treatments/${tid}/medications`)
      .then(({ data }) => {
        setLoading(false);
        setMedications(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  //for add table
  const [addbtn, setAddbtn] = useState(false);

  const handleMedication = () => {
    setAddbtn(true);
  };

  //for modal
  const [errors, setErrors] = useState(null);
  const [medication, setMedication] = useState({
    id: null,
    medicine_id:null,
    description: "",
    quantity: "",
    dosage: "",
  });

  const onEdit = (r) => {
    setErrors(null);
    setAddbtn(true)
    axiosClient
      .get(`/medications/${r.id}`)
      .then(({ data }) => {
        setMedication(data);
      })
      .catch(() => {
      });
  };

  const onArchive = (u) => {
    if (!window.confirm("Are you sure to archive this user?")) {
      return;
    }

    axiosClient.delete(`/users/${u.id}/archive`).then(() => {
      setNotification("User was archived");
      getTreatmentPetMedication();
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (medication.id) {
      axiosClient
        .put(`/medications/${medication.id}`, medication)
        .then(() => {
          setNotification("Medication was successfully updated.");
          getTreatmentPetMedication();
          setAddbtn(false)
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/medications/treatment/${tid}`, medication)
        .then(() => {
          setNotification("Medication was successfully saved.");
          getTreatmentPetMedication();
          setAddbtn(false)
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  const handleFieldChange = (fieldName, value) => {
    const updatedMedication = { ...medication, [fieldName]: value };
    setMedication(updatedMedication);
  };

  const handleRefresh = () => {
    getTreatmentPetMedication();
  };

  useEffect(() => {
  }, []);

  return (
    <>
      {notification && <Alert severity="success">{notification}</Alert>}
      <Stack sx={{ margin:"10px", border: "1px solid black" }}>
        <Box sx={{display:"flex", justifyContent:"space-between",  margin:"5px" }}>
          <Typography> <IconButton color="success" onClick={handleRefresh}>
            <Refresh />
          </IconButton>Medication:</Typography>
        <IconButton
          color="success"
          variant="contained"
          onClick={handleMedication}
        >
          <Add/>
        </IconButton>
        </Box>
        <TableContainer sx={{ height: 300 }} maxwidth="sm">
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

            {addbtn && (
              <TableBody>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <TextField
                      value={medication.description}
                      onChange={(ev) =>
                        handleFieldChange("description", ev.target.value)
                      }
                      label="description"
                      variant="standard"
                      size="small"
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={medication.quantity}
                      onChange={(ev) =>
                        handleFieldChange("quantity", ev.target.value)
                      }
                      label="quantity"
                      variant="standard"
                      size="small"
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={medication.dosage}
                      onChange={(ev) =>
                        handleFieldChange("dosage", ev.target.value)
                      }
                      label="dosage"
                      variant="standard"
                      size="small"
                      required
                    />
                  </TableCell>
                  <TableCell>
                  <Stack direction="row">
                    <IconButton
                      variant="contained"
                      size="small"
                      color="success"
                      onClick={(e) => onSubmit(e)}
                    >
                      <Save fontSize="small" />
                    </IconButton>
                    <IconButton
                      variant="contained"
                      size="small"
                      color="success"
                      onClick={(e) => onSubmit(e)}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {!loading && (
              <TableBody>
                {medications &&
                  medications.map((r) => (
                    <TableRow hover role="checkbox" key={r.id}>
                      <TableCell>{r.medicine.medicine}</TableCell>
                      <TableCell>{r.medicine.price}</TableCell>
                      <TableCell>{r.description}</TableCell>
                      <TableCell>{r.quantity}</TableCell>
                      <TableCell>{r.dosage}</TableCell>
                      <TableCell>
                        <Stack direction="row">
                          <IconButton
                            variant="contained"
                            size="small"
                            color="info"
                            onClick={() => onEdit(r)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => onArchive(r)}
                          >
                            <Archive fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Stack>
    </>
  );
}
