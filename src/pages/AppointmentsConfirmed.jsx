import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { DoneAll, Edit } from "@mui/icons-material";
import EditAppointment from "../components/modals/EditAppointment";
import DropDownButtons from "../components/DropDownButtons";
import { useStateContext } from "../contexts/ContextProvider";

export default function AppointmentsConfirmed() {
  const { notification, setNotification } = useStateContext();

  //for table
  const columns = [
    { id: "Date", name: "Date" },
    { id: "client", name: "Client" },
    { id: "Service", name: "Service" },
    { id: "Purpose", name: "Purpose" },
    { id: "Remarks", name: "Remarks" },
    { id: "Veterinarian", name: "Veterinarian" },
    { id: "Status", name: "Status" },
    { id: "Actions", name: "Actions" },
  ];

  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(10);

  const handlechangepage = (event, newpage) => {
    pagechange(newpage);
  };
  const handleRowsPerPage = (event) => {
    rowperpagechange(+event.target.value);
    pagechange(0);
  };

  const [opennotif, setOpennotif] = useState(false);
  const [message, setMessage] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const getAppointments = () => {
    setAppointments([])
    setLoading(true);
    axiosClient
      .get("/appointments/confirmed")
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

  const getVets = () => {
    axiosClient
      .get(`/vets`)
      .then(({ data }) => {
        setDoctors(data.data);
      })
      .catch(() => {});
  };

  //for modal
  const [errors, setErrors] = useState(null);
  const [modalloading, setModalloading] = useState(false);
  const [appointment, setAppointment] = useState({
    id: null,
    date: "",
    purpose: "",
    remarks: "",
    petowner_id: null,
    service_id: null,
    vet_id: null,
  });
  const [petowner, setPetowner] = useState({
    id: null,
    firstname: "",
    lastname: "",
  });
  const [open, openchange] = useState(false);

  const closepopup = () => {
    openchange(false);
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
        setPetowner(data.petowner);
      })
      .catch(() => {
        setModalloading(false);
      });
    openchange(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (appointment.id) {
      axiosClient
        .put(`/appointments/${appointment.id}`, appointment)
        .then(() => {
          setNotification("Appointment was successfully updated");
          openchange(false);
          setOpennotif(true);
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
        .post(`/appointments`, appointment)
        .then(() => {
          setNotification("Appointment was successfully created");
          openchange(false);
          setOpennotif(true);
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
          <DropDownButtons
            title="Confirmed Appointments"
            optionLink1="/admin/appointments"
            optionLabel1="Scheduled"
            optionLink2="/admin/appointments/pending"
            optionLabel2="Pending"
            optionLink3="/admin/appointments/completed"
            optionLabel3="Completed"
          />
        </Box>

        <EditAppointment
          open={open}
          onClose={closepopup}
          onClick={closepopup}
          onSubmit={onSubmit}
          loading={modalloading}
          petowner={petowner}
          services={services}
          doctors={doctors}
          appointment={appointment}
          setAppointment={setAppointment}
          errors={errors}
          isUpdate={true}
        />

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
                        <TableCell>{`${r.petowner.firstname} ${r.petowner.lastname}`}</TableCell>
                        <TableCell>{r.service.service}</TableCell>
                        <TableCell>{r.purpose}</TableCell>
                        <TableCell>{r.remarks}</TableCell>
                        <TableCell>{r.vet.fullname}</TableCell>
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

                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              onClick={() => onDone(r)}
                            >
                              <DoneAll fontSize="small" />
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
          count={appointments.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar
            open={opennotif}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert severity="success" sx={{ width: "100%" }}>
              {notification}
            </Alert>
          </Snackbar>
        </Stack>
      </Paper>
    </>
  );
}
