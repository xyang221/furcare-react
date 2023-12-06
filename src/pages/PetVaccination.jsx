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

export default function PetVaccination() {
  const { id } = useParams();

  const columns = [
    { id: "date", name: "Date" },
    { id: "weight", name: "Weight" },
    { id: "Against", name: "Against" },
    { id: "Description", name: "Description" },
    { id: "Administered", name: "Administered" },
    { id: "Return", name: "Return" },
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
  const [againsts, setAgainsts] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [vaccinationlog, setVaccinationlog] = useState({
    id: null,
    weight: "",
    description: "",
    administered: "",
    return: null,
    pet_id: null,
    vaccination_againsts: [],
  });
  const [pet, setPet] = useState([]);

  const [openAdd, setOpenAdd] = useState(false);


  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Function to handle checkbox changes
  const handleCheckboxChange = (item) => {
    setVaccinationlog((prevVaccinationlog) => {
      const updatedVaccinationAgainsts = {
        ...prevVaccinationlog.vaccination_againsts,
      };

      if (updatedVaccinationAgainsts[item.id]) {
        // Remove the item if it exists (unchecked)
        delete updatedVaccinationAgainsts[item.id];
      } else {
        // Add the item if it doesn't exist (checked)
        updatedVaccinationAgainsts[item.id] = item;
      }

      return {
        ...prevVaccinationlog,
        vaccination_againsts: updatedVaccinationAgainsts,
      };
    });
  };

  const getVaccination = () => {
    setMessage(null);
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

  const getAgainsts = () => {
    axiosClient
      .get(`/againsts`)
      .then(({ data }) => {
        setAgainsts(data.data);
      })
      .catch(() => {
      });
  };

  const handleCloseModal = () => {
    setOpenAdd(false);
  };

  const handleArchive = (record) => {
    if (!window.confirm("Are you sure to archive this?")) {
      return;
    }

    axiosClient.delete(`/vaccinationlogs/${record.id}/archive`).then(() => {
      setNotification("Vaccination record was archived.");
      getVaccination();
    });
  };

  const handleEdit = (record) => {
    getAgainsts();
    setErrors(null);
    axiosClient
      .get(`/vaccinationlogs/${record.id}`)
      .then(({ data }) => {
        setVaccinationlog(data);
        setPet(data.pet)
        const checkedAgainst = data.vaccination_againsts.map((a) => a);
        setCheckedItems(checkedAgainst);
        // setCheckedItems(data.vaccination_againsts)
        // console.log(checkedItems);
      })
      .catch(() => {
      });

    setOpenAdd(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (vaccinationlog.id) {
      axiosClient
        .put(`/vaccinationlogs/${vaccinationlog.id}`, vaccinationlog)
        .then(() => {
          setNotification("Vaccination was successfully updated.");
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

          <VaccinationLogsModal
            open={openAdd}
            onClose={handleCloseModal}
            onClick={handleCloseModal}
            onSubmit={handleSubmit}
            loading={loading}
            againsts={againsts}
            pets={pet}
            checkedItems={checkedItems}
            setCheckedItems={setCheckedItems}
            vaccination={vaccinationlog}
            setVaccination={setVaccinationlog}
            errors={errors}
            pet={pet}
            isUpdate={vaccinationlog.id}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            handleCheckboxChange={handleCheckboxChange}
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
                    <TableCell colSpan={8} style={{ textAlign: "center" }}>
                      Loading...
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}

              {!loading && message && (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={8} style={{ textAlign: "center" }}>
                      {message}
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}

              {!loading && (
                <TableBody>
                  {vaccinationlogs &&
                    vaccinationlogs
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((record) => (
                        <TableRow hover role="checkbox" key={record.id}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{`${record.weight} kg`}</TableCell>
                          <TableCell>
                            {record.vaccination_againsts.map((va_against) => (
                              <span key={va_against.id}>
                                {va_against.acronym}
                              </span>
                            ))}
                          </TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell>{record.administered}</TableCell>
                          <TableCell>{record.return}</TableCell>
                          <TableCell>{record.servicesavailed.status}</TableCell>
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
