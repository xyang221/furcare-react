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

export default function PetVaccinationLogs({ sid }) {
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

  //   if (updatedVaccinationAgainst.includes(itemId)) {
  //     updatedVaccinationAgainst = updatedVaccinationAgainst.filter(
  //       (id) => id !== itemId
  //     );
  //   } else {
  //     updatedVaccinationAgainst.push(itemId);
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
  const handleCheckboxChange = (itemid) => {
    const { name, checked } = event.target;
    setVaccinationlog({
      ...vaccinationlog,
      [itemid]: checked,
    });
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
            vaccination_againsts={vaccinationlog.vaccination_againsts}
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
                          <TableCell>{record.vaccination_againsts}</TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell>{record.administered}</TableCell>
                          {againsts
                            .filter(
                              (ag) => ag.id === record.vaccination_againsts.indexOf()
                            )
                            .map((filteredItem) => (
                              <TableCell key={filteredItem.id}>
                                {filteredItem.acronym}
                              </TableCell>
                            ))}

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
