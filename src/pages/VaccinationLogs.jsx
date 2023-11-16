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
import { Add, Archive, Visibility } from "@mui/icons-material";
import VaccinationLogsModal from "../components/modals/VaccinationLogsModal";

export default function VaccinationLogs() {
  //for table
  const columns = [
    { id: "id", name: "ID" },
    { id: "date", name: "Date" },
    { id: "weight", name: "Weight" },
    { id: "Description", name: "Description" },
    { id: "Against", name: "Against" },
    { id: "Administered", name: "Administered" },
    { id: "Status", name: "Status" },
    { id: "Actions", name: "Actions" },
  ];

  const handlechangepage = (event, newpage) => {
    pagechange(newpage);
  };
  const handleRowsPerPage = (event) => {
    rowperpagechange(+event.target.value);
    pagechange(0);
  };

  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(10);

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState(null);

  const [vaccinations, setVaccinationlogs] = useState([]);

  const [checkedItems, setCheckedItems] = useState({});

  const getVaccination = () => {
    setLoading(true);
    axiosClient
      .get(`/vaccinationlogs`)
      .then(({ data }) => {
        setLoading(false);
        setVaccinationlogs(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const [pets, setPets] = useState([]);

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

  const [againsts, setAgainsts] = useState([]);

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

  const [vaccination, setVaccination] = useState({
    id: null,
    date: "",
    weight: null,
    description: "",
    administered: "",
    status: "",
    pet_id: null,
  });

  const [vaccination_against, setVaccination_against] = useState({
    id: null,
    vaccinationlog_id: null,
    against_id: null,
  });

  const [openAdd, setOpenAdd] = useState(false);
  const addModal = (ev) => {
    getPets();
    getAgainsts();
    setOpenAdd(true);
    setVaccination({});
    setErrors(null);
  };

  const closepopup = () => {
    setOpenAdd(false);
  };

  const onArchive = (u) => {
    if (!window.confirm("Are you sure to archive this?")) {
      return;
    }

    axiosClient.delete(`/vaccination/${u.id}/archive`).then(() => {
      setNotification("Pet Owner was archived");
      getVaccination();
    });
  };

  const onSubmit = () => {
    if (vaccination.id) {
      axiosClient
        .put(`/vaccination/${vaccination.id}`, vaccination)
        .then(() => {
          setNotification("vaccination was successfully updated");
          openAdd(false);
          getVaccination();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/vaccination`, vaccination)
        .then(() => {
          setNotification("vaccination was successfully created");
          setOpenAdd(false);
          getVaccination();
        })
        .catch((err) => {
          const response = err.response;
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
          margin: "10px",
        }}
      >
        <Box
          p={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Typography variant="h4">Vaccination Logs</Typography>{" "}
          <Button
            onClick={addModal}
            variant="contained"
            color="success"
            size="small"
          >
            <Add />
          </Button>
        </Box>

        <VaccinationLogsModal
          open={openAdd}
          onClose={closepopup}
          onClick={closepopup}
          onSubmit={onSubmit}
          loading={loading}
          pets={pets}
          // petid={id}
          vaccination={vaccination}
          setVaccination={setVaccination}
          againsts={againsts}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          errors={errors}
          // petid={pet.id}
          isUpdate={vaccination.id}
        />

        {/* <Button
            component={Link}
            to={`/admin/vaccination/archives`}
            variant="contained"
            color="success"
            size="small"
          >
            <Typography>Archives</Typography>
          </Button> */}

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
                {vaccinations &&
                  vaccinations
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.id}</TableCell>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>{r.wieght}</TableCell>
                        <TableCell>{r.description}</TableCell>
                        <TableCell>{r.administered}</TableCell>
                        <TableCell>{r.status}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2}>
                            <Button
                              component={Link}
                              to={`/admin/vaccinations/` + r.id + `/view`}
                              variant="contained"
                              color="info"
                              size="small"
                            >
                              <Visibility fontSize="small" />
                            </Button>

                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() => onArchive(r)}
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
          rowsPerPage={rowperpage}
          page={page}
          count={vaccinations.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
    </>
  );
}
