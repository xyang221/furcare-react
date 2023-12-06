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

export default function Vaccination({ sid }) {
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
  const [pets, setPets] = useState([]);
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

  const [openAdd, setOpenAdd] = useState(false);

  const { id } = useParams();

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // const handleCheckboxChange = (itemId) => {
  //   let updatedVaccinationAgainst = [...vaccinationlog.vaccination_againsts];

  //   if (checkedItems.includes(itemId)) {
  //     updatedVaccinationAgainst = checkedItems.filter(
  //       (id) => id !== itemId
  //     );
  //   } else {
  //     checkedItems.push(itemId);
  //   }

  //   setVaccinationlog((prevVaccinationlog) => ({
  //     ...prevVaccinationlog,
  //     vaccination_againsts: updatedVaccinationAgainst,
  //   }));
  // };

  // const handleCheckboxChange = (itemId) => {
  //   setVaccinationlog((prevVaccinationlog) => {
  //     const updatedVaccinationAgainst = prevVaccinationlog.vaccination_againsts.includes(itemId)
  //       ? prevVaccinationlog.vaccination_againsts.filter((id) => id !== itemId)
  //       : [...prevVaccinationlog.vaccination_againsts, itemId];

  //     return {
  //       ...prevVaccinationlog,
  //       vaccination_againsts: updatedVaccinationAgainst,
  //     };
  //   });
  // };

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
      .get(`/vaccinationlogs/petowner/${id}/service/${sid}`)
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
    setMessage("");
    axiosClient
      .get(`/petowners/${id}/pets`)
      .then(({ data }) => {
        setPets(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
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
    setCheckedItems({});
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
        const checkedAgainst = data.vaccination_againsts.map((a) => a);
        setCheckedItems(checkedAgainst);
        // setCheckedItems(data.vaccination_againsts)
        console.log(checkedItems);
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
    } else {
      axiosClient
        .post(`/vaccinationlogs/petowner/${id}/service/${sid}`, vaccinationlog)
        .then(() => {
          setNotification("Vaccination was successfully saved.");
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

  console.log(vaccinationlog);

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
          {sid && (
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
          )}

          <VaccinationLogsModal
            open={openAdd}
            onClose={handleCloseModal}
            onClick={handleCloseModal}
            onSubmit={handleSubmit}
            loading={loading}
            pets={pets}
            againsts={againsts}
            checkedItems={checkedItems}
            setCheckedItems={setCheckedItems}
            vaccination={vaccinationlog}
            setVaccination={setVaccinationlog}
            errors={errors}
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
                                {va_against.acronym}{" "}
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
