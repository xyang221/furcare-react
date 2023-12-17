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
import { ContextProvider, useStateContext } from "../contexts/ContextProvider";

export default function PetConditionAdmission({ tid }) {

  const {notification, setNotification} = useStateContext();
  //for table
  const columns = [
    // { id: "id", name: "ID" },
    { id: "AM/PM", name: "AM/PM" },
    { id: "eating", name: "eating" },
    { id: "drinking", name: "drinking" },
    { id: "urinated", name: "urinated" },
    { id: "vomit", name: "vomit" },
    { id: "defecated", name: "defecated" },
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

  const handleClose = () => {
    setAddbtn(false);
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
  const [open, openchange] = useState(false);

  const addModal = (ev) => {
    setErrors(null);
    openchange(true);
  };

  const closepopup = () => {
    openchange(false);
  };

  const onEdit = (r) => {
    setErrors(null);
    // setModalloading(true);
    setAddbtn(true)
    axiosClient
      .get(`/petconditions/${r.id}`)
      .then(({ data }) => {
        // setModalloading(false);
        setPetcondition(data);
      })
      .catch(() => {
        // setModalloading(false);
      });
    openchange(true);
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
          openchange(false);
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
          openchange(false);
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

  const handleRefresh = () => {
    getTreatmentPetCondition();
  };

  useEffect(() => {
    if(tid){
    getTreatmentPetCondition();
    }
  }, []);

  return (
    <>
        {notification && <Alert severity="success">{notification}</Alert>}
      <Stack sx={{ margin:"10px", border: "1px solid black" }}>
        <Box sx={{display:"flex", justifyContent:"space-between",  margin:"5px" }}>
          <Typography> <IconButton color="success" onClick={handleRefresh}>
            <Refresh />
          </IconButton>Pet Condition:</Typography>
        <IconButton
          color="success"
          variant="contained"
          onClick={handlePetCondition}
        >
          <Add/>
        </IconButton>
        </Box>
        <TableContainer sx={{ height: 300,  }} maxwidth="sm">
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
                      color="error"
                      onClick={handleClose}
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
