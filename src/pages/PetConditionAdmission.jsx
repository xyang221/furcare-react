import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import {
  Alert,
  Box,
  IconButton,
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
import { Add, Archive, Close, Edit, Refresh, Save } from "@mui/icons-material";

export default function PetConditionAdmission({ tid }) {
  //for table
  const columns = [
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
  const [message, setMessage] = useState("");

  const getTreatmentPetCondition = () => {
    setMessage("");
    setLoading(true);
    axiosClient
      .get(`/treatments/${tid}/petconditions`)
      .then(({ data }) => {
        setLoading(false);
        setPetconditions(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  //for add table
  const [addbtn, setAddbtn] = useState(false);

  const handlePetCondition = () => {
    setAddbtn(true);
    setPetcondition({});
  };

  const handleClose = () => {
    setAddbtn(false);
  };

  //for modal
  const [errors, setErrors] = useState(null);
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
    setAddbtn(true);
    axiosClient
      .get(`/petconditions/${r.id}`)
      .then(({ data }) => {
        setPetcondition(data);
      })
      .catch(() => {});
  };

  const onArchive = (u) => {
    if (!window.confirm("Are you sure to archive this user?")) {
      return;
    }

    axiosClient.delete(`/users/${u.id}/archive`).then(() => {
      getTreatmentPetCondition();
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (petcondition.id) {
      axiosClient
        .put(`/petconditions/${petcondition.id}`, petcondition)
        .then(() => {
          getTreatmentPetCondition();
          setAddbtn(false);
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
          getTreatmentPetCondition();
          setAddbtn(false);
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
    getTreatmentPetCondition();
  }, []);

  return (
    <>
      <Stack sx={{ margin: "5px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography>
            <IconButton color="success" onClick={handleRefresh}>
              <Refresh />
            </IconButton>
            Pet Condition:
          </Typography>
          <IconButton
            color="success"
            variant="contained"
            onClick={handlePetCondition}
          >
            <Add />
          </IconButton>
        </Box>
        <TableContainer maxwidth="sm">
          {errors && (
            <Box>
              {Object.keys(errors).map((key) => (
                <Alert severity="error" key={key}>
                  {errors[key][0]}
                </Alert>
              ))}
            </Box>
          )}
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
                  <TableCell
                    colSpan={columns.length}
                    style={{ textAlign: "center" }}
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
            {!loading && !addbtn && message && (
              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    style={{ textAlign: "center" }}
                  >
                    {message}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {!loading && (
              <TableBody>
                {petconditions &&
                  petconditions.map((r) => (
                    <TableRow hover role="checkbox" key={r.id}>
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
            {addbtn && (
              <TableBody>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <TextField
                      value={petcondition.eating || ""}
                      onChange={(ev) =>
                        handleFieldChange("eating", ev.target.value)
                      }
                      label="eating"
                      variant="standard"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={petcondition.drinking || ""}
                      onChange={(ev) =>
                        handleFieldChange("drinking", ev.target.value)
                      }
                      label="drinking"
                      variant="standard"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={petcondition.urinated || ""}
                      onChange={(ev) =>
                        handleFieldChange("urinated", ev.target.value)
                      }
                      label="urinated"
                      variant="standard"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={petcondition.vomit || ""}
                      onChange={(ev) =>
                        handleFieldChange("vomit", ev.target.value)
                      }
                      label="vomit"
                      variant="standard"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={petcondition.defecated || ""}
                      onChange={(ev) =>
                        handleFieldChange("defecated", ev.target.value)
                      }
                      label="defecated"
                      variant="standard"
                      size="small"
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
          </Table>
        </TableContainer>
      </Stack>
    </>
  );
}
