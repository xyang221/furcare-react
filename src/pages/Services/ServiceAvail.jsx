import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
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
import { Link, useParams } from "react-router-dom";
import { Add, Archive, Visibility } from "@mui/icons-material";
import ServiceAvailModal from "../../components/modals/ServiceAvailModal";

export default function ServiceAvail({ sid, title }) {
  const { id } = useParams();

  const columns = [
    { id: "Date", name: "Date" },
    { id: "Pet", name: "Pet" },
    { id: "Status", name: "Status" },
    { id: "Actions", name: "Actions" },
  ];

  const [notification, setNotification] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [serviceavails, setServiceavails] = useState([]);

  const getServiceAvailed = () => {
    setServiceavails([])
    setMessage(null)
    setLoading(true);
    axiosClient
      .get(`/servicesavailed/petowner/${id}/service/${sid}`)
      .then(({ data }) => {
        setLoading(false);
        setServiceavails(data.data);
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
    axiosClient
      .get(`/petowners/${id}/pets`)
      .then(({ data }) => {
        setPets(data.data);
      })
      .catch(() => {});
  };

  //for table
  const handlechangepage = (event, newpage) => {
    pagechange(newpage);
  };
  const handleRowsPerPage = (event) => {
    rowperpagechange(+event.target.value);
    pagechange(0);
  };

  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(10);

  //for modal
  const [errors, setErrors] = useState(null);
  const [service, setServiceavail] = useState({
    id: null,
    pet_id: null,
    unit_price:null,
  });

  const [open, openServiceavail] = useState(false);

  const addModal = (ev) => {
    openServiceavail(true);
    getPets();
    setServiceavail({});
    setErrors(null);
  };

  const closeModal = () => {
    openServiceavail(false);
  };

  const onArchive = (u) => {
    if (!window.confirm("Are you sure to archive this?")) {
      return;
    }

    axiosClient.delete(`/servicesavailed/${u.id}/archive`).then(() => {
      setNotification("This service availed record was archived.");
      getServiceAvailed();
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    if (service.id) {
      axiosClient
        .put(`/diagnosis/${service.id}`, service)
        .then(() => {
          setNotification("diagnosis was successfully updated");
          openServiceavail(false);
          getServiceAvailed();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/servicesavailed/petowner/${id}/service/${sid}`, service)
        .then(() => {
          setNotification("Service availed was successfully saved");
          openServiceavail(false);
          getServiceAvailed();
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
    getServiceAvailed();
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
        <Box display="flex" flexDirection="row" justifyContent="space-between">

          <Button
            onClick={addModal}
            variant="contained"
            color="success"
            size="small"
          >
            <Add />
          </Button>
        </Box>
        <br></br>

        <ServiceAvailModal
          open={open}
          onClose={closeModal}
          onClick={closeModal}
          onSubmit={onSubmit}
          title={title}
          pets={pets}
          addpet={true}
          serviceavail={service}
          setServiceavail={setServiceavail}
          errors={errors}
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
                  <TableCell colSpan={5} style={{ textAlign: "center" }}>
                    Loading...
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {!loading && message && (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: "center" }}>
                    {message}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {!loading && (
              <TableBody>
                {serviceavails &&
                  serviceavails
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.date_availed_for}</TableCell>
                        <TableCell>{r.pet.name}</TableCell>
                        <TableCell>{r.status}</TableCell>
                        <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() => onArchive(r)}
                            >
                              <Archive fontSize="small" />
                            </Button>
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
          count={serviceavails.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
    </>
  );
}
