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
  Save,
} from "@mui/icons-material";
import { useStateContext } from "../contexts/ContextProvider";

export default function PetMedicationAdmission({ tid }) {

  const {notification, setNotification} = useStateContext();
  //for table
  const columns = [
    { id: "AM/PM", name: "AM/PM" },
    { id: "medicine", name: "medicine" },
    { id: "price", name: "price" },
    { id: "description", name: "description" },
    { id: "qty", name: "qty" },
    { id: "dosage", name: "dosage" },
    { id: "Actions", name: "Actions" },
  ];

  const [loading, setLoading] = useState(false);
  const [petconditions, setPetconditions] = useState([]);
  // const [notification, setNotification] = useState("");

  const getTreatmentPetCondition = () => {
    setLoading(true);
    axiosClient
      .get(`/treatments/${tid}/petconditions`)
      .then(({ data }) => {
        setLoading(false);
        setPetconditions(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  //for add table
  const [addbtn, setAddbtn] = useState(false);

  const handlePetCondition = () => {
    setAddbtn(true);
  };

  //for modal
  const [errors, setErrors] = useState(null);
  const [modalloading, setModalloading] = useState(false);
  const [petcondition, setPetcondition] = useState({
    id: null,
    is_AM_or_PM: "",
    eating: "",
    drinking: "",
    urinated: "",
    vomit: "",
    defecated: "",
  });

  const onEdit = (r) => {
    setErrors(null);
    setAddbtn(true)
    axiosClient
      .get(`/petconditions/${r.id}`)
      .then(({ data }) => {
        setPetcondition(data);
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
      getTreatmentPetCondition();
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (petcondition.id) {
      axiosClient
        .put(`/petconditions/${petcondition.id}`, petcondition)
        .then(() => {
          setNotification("Pet condition was successfully updated.");
          getTreatmentPetCondition();
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
        .post(`/petconditions/treatment/${tid}`, petcondition)
        .then(() => {
          setNotification("Pet condition was successfully saved.");
          getTreatmentPetCondition();
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
    const updatedPetcondition = { ...petcondition, [fieldName]: value };

    setPetcondition(updatedPetcondition);
  };

  useEffect(() => {
    getTreatmentPetCondition();
  }, []);

  return (
    <>
      <Stack sx={{ border: "1px solid black" }}>
        <Box sx={{display:"flex", justifyContent:"space-between"}}>
          <Typography>Medication:</Typography>
        <Button
          color="success"
          variant="contained"
          onClick={handlePetCondition}
        >
          Add
        </Button>
        </Box>
        {notification && <Alert severity="success">{notification}</Alert>}
        <TableContainer sx={{ height: 340 }} maxwidth="sm">
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
                      value={petcondition.eating}
                      onChange={(ev) =>
                        handleFieldChange("eating", ev.target.value)
                      }
                      label="eating"
                      variant="standard"
                      size="small"
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={petcondition.drinking}
                      onChange={(ev) =>
                        handleFieldChange("drinking", ev.target.value)
                      }
                      label="drinking"
                      variant="standard"
                      size="small"
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={petcondition.urinated}
                      onChange={(ev) =>
                        handleFieldChange("urinated", ev.target.value)
                      }
                      label="urinated"
                      variant="standard"
                      size="small"
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={petcondition.vomit}
                      onChange={(ev) =>
                        handleFieldChange("vomit", ev.target.value)
                      }
                      label="vomit"
                      variant="standard"
                      size="small"
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={petcondition.defecated}
                      onChange={(ev) =>
                        handleFieldChange("defecated", ev.target.value)
                      }
                      label="defecated"
                      variant="standard"
                      size="small"
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      variant="contained"
                      size="small"
                      color="success"
                      onClick={(e) => onSubmit(e)}
                    >
                      <Check fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {!loading && (
              <TableBody>
                {petconditions &&
                  petconditions.map((r) => (
                    <TableRow hover role="checkbox" key={r.id}>
                      {/* <TableCell>{r.id}</TableCell> */}
                      <TableCell>{r.is_AM_or_PM}</TableCell>
                      <TableCell>{r.eating}</TableCell>
                      <TableCell>{r.drinking}</TableCell>
                      <TableCell>{r.urinated}</TableCell>
                      <TableCell>{r.vomit}</TableCell>
                      <TableCell>{r.defecated}</TableCell>
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
