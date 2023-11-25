import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Add, Archive, Edit } from "@mui/icons-material";
import VaccinationLogsModal from "../components/modals/VaccinationLogsModal";

export default function PetVaccinationLogs({sid}) {
  const columns = [
    { id: "date", name: "Date" },
    { id: "weight", name: "Weight" },
    { id: "Description", name: "Description" },
    { id: "Administered", name: "Administered" },
    { id: "Status", name: "Status" },
    { id: "Actions", name: "Actions" },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState(null);
  const [vaccinationlogs, setVaccinationlogs] = useState([]);
  const [pets, setPets] = useState([]);
  const [againsts, setAgainsts] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [vaccinationlog, setVaccinationlog] = useState({
    id: null,
    weight: "",
    description: "",
    administered: "",
    status: "",
    pet_id: null,
  });

  const [vaccinationagainst, setVaccinationagainst] = useState({
    id: null,
    against: "",
  });
  const [openAdd, setOpenAdd] = useState(false);

  const { id } = useParams();

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getVaccination = () => {
    setLoading(true);
    axiosClient
      .get(`/vaccinationlogs/pet/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setVaccinationlogs(data.data);
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.status === 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const getPets = () => {
    setLoading(true);
    axiosClient
      .get(`/pets`)
      .then(({ data }) => {
        setLoading(false);
        setPets(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getAgainsts = () => {
    setLoading(true);
    axiosClient
      .get(`/againsts`)
      .then(({ data }) => {
        setLoading(false);
        setAgainsts(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleOpenAddModal = () => {
    getPets();
    getAgainsts();
    setOpenAdd(true);
    setVaccinationlog({});
    setErrors(null);
  };

  const handleCloseModal = () => {
    setOpenAdd(false);
  };

  const handleArchive = (record) => {
    if (!window.confirm("Are you sure to archive this?")) {
      return;
    }

    axiosClient.delete(`/vaccinationlogs/${record.id}/archive`).then(() => {
      setNotification("Pet Owner was archived");
      getVaccination();
    });
  };

  const handleEdit = (record) => {
    getPets();
    getAgainsts();
    setErrors(null);
    setLoading(true);

    axiosClient
      .get(`/vaccinationlogs/${record.id}`)
      .then(({ data }) => {
        setLoading(false);
        setVaccinationlog(data);
      })
      .catch(() => {
        setLoading(false);
      });

    setOpenAdd(true);
  };

  const handleSubmit = () => {
    if (vaccinationlog.id) {
      axiosClient
        .put(`/vaccinationlogs/${vaccinationlog.id}`, vaccinationlog)
        .then(() => {
          setNotification("vaccinationlog was successfully updated");
          setOpenAdd(false);
          getVaccination();
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/vaccinationlogs/pet/${vaccinationlog.pet_id}`, vaccinationlog)
        .then(() => {
          setNotification("vaccinationlog was successfully created");
          setOpenAdd(false);
          getVaccination();
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  useEffect(() => {
    getVaccination();
  }, []);

  return (
    <>
     <Paper
        sx={{
          minWidth: "90%",
          padding: "10px",
        }}
      >
      <Box sx={{ minWidth: "90%" }}>
        <Box
          p={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Button
            onClick={handleOpenAddModal}
            variant="contained"
            color="success"
            size="small"
          >
            <Add />
          </Button>
        </Box>

        <VaccinationLogsModal
          open={openAdd}
          onClose={handleCloseModal}
          onClick={handleCloseModal}
          onSubmit={handleSubmit}
          loading={loading}
          pets={pets}
          petid={id}
          againsts={againsts}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          vaccination={vaccinationlog}
          setVaccination={setVaccinationlog}
          errors={errors}
          isUpdate={vaccinationlog.id}
        />

        {notification && <Alert severity="success">{notification}</Alert>}

        <TableContainer sx={{ height: 380 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    style={{ backgroundColor: "black", color: "white" }}
                    key={column.id}
                  >
                    {column.name}
                  </TableCell>
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

            {!loading && message && (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7} style={{ textAlign: "center" }}>
                    {message}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {!loading && (
              <TableBody>
                {vaccinationlogs &&
                  vaccinationlogs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((record) => (
                      <TableRow hover role="checkbox" key={record.id}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{`${record.weight} kg`}</TableCell>
                        <TableCell>{record.description}</TableCell>
                        <TableCell>{record.administered}</TableCell>
                        <TableCell>{record.status}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2}>
                            <Button
                              variant="contained"
                              size="small"
                              color="info"
                              onClick={() => handleEdit(record)}
                            >
                              <Edit fontSize="small" />
                            </Button>

                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() => handleArchive(record)}
                            >
                              <Archive fontSize="small" />
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 15, 25]}
          rowsPerPage={rowsPerPage}
          page={page}
          count={vaccinationlogs.length}
          component="div"
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        ></TablePagination>
      </Box>
      </Paper>
    </>
  );
}
