import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { Add, DoneAll, ArrowBackIos, Edit } from "@mui/icons-material";
import EditAppointment from "../components/modals/EditAppointment";

export default function PetOwnerAppointments({ petowner }) {
  //for table
  const columns = [
    { id: "Date", name: "Date" },
    { id: "Purpose", name: "Purpose" },
    { id: "Service", name: "Service" },
    { id: "Remarks", name: "Remarks" },
    { id: "Veterinarian", name: "Veterinarian" },
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

  const [notification, setNotification] = useState("");
  const [message, setMessage] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  //for modal
  const [errors, setErrors] = useState(null);
  const [modalloading, setModalloading] = useState(false);
  const [appointment, setAppointment] = useState({
    id: null,
    date: "",
    purpose: "",
    remarks: "",
    service_id: null,
    vet_id: null,
  });
  const [open, setOpen] = useState(false);

  const [services, setServices] = useState([]);

  const getAppointments = () => {
    setMessage("");
    setLoading(true);
    axiosClient
      .get(`/petowners/${id}/appointments`)
      .then(({ data }) => {
        setLoading(false);
        setAppointments(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const getServices = () => {
    axiosClient
      .get(`/services`)
      .then(({ data }) => {
        setServices(data.data);
      })
      .catch(() => {});
  };

  const [doctors, setDoctors] = useState([]);

  const getVets = () => {
    axiosClient
      .get(`/doctors`)
      .then(({ data }) => {
        setDoctors(data.data);
      })
      .catch(() => {});
  };


  const addModal = (ev) => {
    getVets();
    getServices();
    setOpen(true);
    setAppointment({});
    setErrors(null);
  };

  const closepopup = () => {
    setOpen(false);
  };

  const onDelete = (po) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }

    axiosClient.delete(`/appointments/${po.id}`).then(() => {
      setNotification("Pet Owner deleted");
      getAppointments();
    });
  };

  const onEdit = (r) => {
    setErrors(null);
    getServices();
    getVets();
    setModalloading(true);
    axiosClient
      .get(`/appointments/${r.id}`)
      .then(({ data }) => {
        setModalloading(false);
        setAppointment(data);
      })
      .catch(() => {
        setModalloading(false);
      });
    setOpen(true);
  };

  const onDone = (r) => {
    if (!window.confirm("Are you sure this appointment was done?")) {
      return;
    }

    axiosClient.put(`/appointments/${r.id}/completed`).then(() => {
      setNotification("The appointment was done");
      getAppointments();
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (appointment.id) {
      axiosClient
        .put(`/appointments/${appointment.id}`, appointment)
        .then(() => {
          setNotification("Appointment was successfully updated.");
          setOpen(false);
          getAppointments();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/appointments/petowner/${id}`, appointment)
        .then(() => {
          setNotification("Appointment was successfully saved.");
          setOpen(false);
          getAppointments();
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
    getAppointments();
  }, []);

  return (
    <>
      <Box
        sx={{
          minWidth: "90%",
        }}
      >
        <Box
          p={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Button
            onClick={addModal}
            variant="contained"
            color="success"
            size="small"
          >
            <Add />
          </Button>
        </Box>
        {notification && <Alert severity="success">{notification}</Alert>}

        <EditAppointment
          open={open}
          onClose={closepopup}
          onClick={closepopup}
          onSubmit={onSubmit}
          loading={modalloading}
          petownerid={id}
          petowner={petowner}
          services={services}
          doctors={doctors}
          appointment={appointment}
          setAppointment={setAppointment}
          errors={errors}
          isUpdate={appointment.id}
          // withRemarks={withRemarks}
          // handleChange={handleRemarksChange}
        />

        <TableContainer sx={{ height: 350 }}>
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
                  <TableCell
                    colSpan={columns.length}
                    style={{ textAlign: "center" }}
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              </TableBody>
            )}

            {!loading && message && (
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
                {appointments &&
                  appointments
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>{r.purpose}</TableCell>
                        <TableCell>{r.service.service}</TableCell>
                        <TableCell>{r.remarks}</TableCell>
                        <TableCell>{r.doctor.fullname}</TableCell>
                        <TableCell>{r.status}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2}>
                            <Button
                              variant="contained"
                              size="small"
                              color="info"
                              onClick={() => onEdit(r)}
                            >
                              <Edit fontSize="small" />
                            </Button>
                            {r.status === "Confirmed" && (
                              <Button
                                variant="contained"
                                size="small"
                                color="success"
                                onClick={() => onDone(r)}
                              >
                                <DoneAll fontSize="small" />
                              </Button>
                            )}
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
          count={appointments.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Box>
    </>
  );
}
