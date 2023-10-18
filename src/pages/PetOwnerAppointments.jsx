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
import { Add, Archive, ArrowBackIos, Edit } from "@mui/icons-material";
import EditAppointment from "../components/modals/EditAppointment";

export default function PetOwnerAppointments() {
  //for table
  const columns = [
    { id: "Date", name: "Date" },
    { id: "Purpose", name: "Purpose" },
    { id: "Service", name: "Service" },
    { id: "Status", name: "Status" },
    { id: "Remarks", name: "Remarks" },
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
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const {id} = useParams();
  const navigate = useNavigate()

  const getAppointments = () => {
    setLoading(true);
    axiosClient
      .get(`/petowners/${id}/appointments`)
      .then(({ data }) => {
        setLoading(false);
        setAppointments(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  console.log(appointments)

  const onDelete = (po) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }

    axiosClient.delete(`/appointments/${po.id}`).then(() => {
      setNotification("Pet Owner deleted");
      getAppointments();
    });
  };

  const [services, setServices] = useState([]);

  const getServices = () => {
    setModalloading(true);
    axiosClient
      .get(`/services`)
      .then(({ data }) => {
        setModalloading(false);
        setServices(data.data);
      })
      .catch(() => {
        setModalloading(false);
      });
  };

  // const [petowners, setPetowners] = useState([]);

  // const getPetowners = () => {
  //   setModalloading(true);
  //   axiosClient
  //     .get(`/petowners`)
  //     .then(({ data }) => {
  //       setModalloading(false);
  //       setPetowners(data.data);
  //     })
  //     .catch(() => {
  //       setModalloading(false);
  //     });
  // };

  //for modal
  const [errors, setErrors] = useState(null);
  const [modalloading, setModalloading] = useState(false);
  const [appointment, setAppointment] = useState({
    id: null,
    date: "",
    purpose: "",
    remarks: "",
    client_service_id: null,
  });
  const [open, openchange] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const addModal = (ev) => {
    // getPetowners();
    setOpenAdd(true);
    setAppointment({});
    setErrors(null);
  };

  const closepopup = () => {
    openchange(false);
    setOpenAdd(false);
  };

  const onDone = (r) => {
    if (!window.confirm("Are you sure this appointment was done?")) {
      return;
    }

    axiosClient.put(`/appointments/${r.id}/done`).then(() => {
      setNotification("The appointment was done");
      getAppointments();
    });
  };

  const onEdit = (r) => {
    setErrors(null);
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
    openchange(true);
  };

  const onSubmit = () => {
    if (appointment.id) {
      axiosClient
        .put(`/appointment/${appointment.id}`, appointment)
        .then(() => {
          setNotification("appointment was successfully updated");
          openchange(false);
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
        .post(`/appointment`, appointment)
        .then(() => {
          setNotification("appointment was successfully created");
          setOpenAdd(false);
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
    getServices();
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
        {notification && <Alert severity="success">{notification}</Alert>}
        <Box
          p={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Typography variant="h4">My Appointments</Typography>{" "}
        
          <Button
            //  component={Link}
            //  to={"/admin/appointments/new"}
            onClick={addModal}
            variant="contained"
            size="small"
          >
            <Add />
          </Button>
          <Button
          variant="contained"
          color="error"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIos fontSize="small" />
          <Typography>Back</Typography>
        </Button>
        </Box>

        {/* <EditAppointment
          open={openAdd}
          onClose={closepopup}
          onClick={closepopup}
          onSubmit={onSubmit}
          loading={modalloading}
          // petowners={petowners}
          appointment={appointment}
          setAppointment={setAppointment}
          errors={errors}
          isUpdate={appointment.id}
        /> */}

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

            {!loading && (
              <TableBody>
                {appointments &&
                  appointments
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.date}</TableCell>
                        {/* <TableCell>{`${r.petowner.firstname} ${r.petowner.lastname}`}</TableCell> */}
                        <TableCell>{r.purpose}</TableCell>
                        <TableCell>{r.clientservice.service.service}</TableCell>
                        <TableCell>{r.status}</TableCell>
                        <TableCell>{r.remarks}</TableCell>
                        {/* <TableCell>
                          <Stack direction="row" spacing={2}>
                           
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              onClick={() => onDone(r)}
                            >
                              <Typography>done</Typography>
                            </Button>
                          </Stack>
                        </TableCell> */}
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
      </Paper>
    </>
  );
}
