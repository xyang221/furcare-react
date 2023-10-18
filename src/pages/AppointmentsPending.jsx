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

import EditAppointment from "../components/modals/EditAppointment";
import DropDownButtons from "../components/DropDownButtons";

export default function AppointmentsPending() {

  //for table
    const columns = [
        { id: "Date", name: "Date" },
        { id: "client", name: "Client" },
        { id: "Purpose", name: "Purpose" },
        { id: "Service", name: "Service" },
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
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAppointments = () => {

        setLoading(true);
        axiosClient.get('/appointments/pending')
            .then(({ data }) => {
                setLoading(false);
                setAppointments(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const [services,setServices] = useState([]);

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
    }

    const [petowners,setPetowners] = useState([]);


    const getPetowners = () => {
        setModalloading(true);
        axiosClient
          .get(`/petowners`)
          .then(({ data }) => {
            setModalloading(false);
            setPetowners(data.data);
          })
          .catch(() => {
            setModalloading(false);
          });
    }

  const [errors, setErrors] = useState(null);
  const [modalloading, setModalloading] = useState(false);

  const onAccept = (r) => {
    if (!window.confirm("Are you sure to accept this appointment?")) {
      return;
    }

    axiosClient.put(`/appointments/${r.id}/schedule`).then(() => {
      setNotification("The appointment was scheduled");
      getAppointments();
    });
  };

  const onCancel = (r) => {
    if (!window.confirm("Are you sure to cancel this appointment?")) {
      return;
    }

    axiosClient.put(`/appointments/${r.id}/cancel`).then(() => {
      setNotification("The appointment was cancelled");
      getAppointments();
    });
  };

  useEffect(() => {
    getServices()
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
            <Typography variant="h4">Pending Appointments</Typography>{" "}

            <DropDownButtons
            optionLink1="/admin/appointments/scheduled"
            optionLabel1="Scheduled"
            optionLink2="/admin/appointments/done"
            optionLabel2="Done"
            optionLink3="/admin/appointments"
            optionLabel3="Today"
          />

          </Box>

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
    
              {!loading && (
                <TableBody>
                  {appointments &&
                    appointments
                      .slice(page * rowperpage, page * rowperpage + rowperpage)
                      .map((r) => (
                        <TableRow hover role="checkbox" key={r.id}>
                          <TableCell>{r.date}</TableCell>
                        <TableCell>{`${r.petowner.firstname} ${r.petowner.lastname}`}</TableCell>
                          <TableCell>{r.purpose}</TableCell>
                          <TableCell>{r.clientservice.service.service}</TableCell>
                          <TableCell>{r.status}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={2}>
                              <Button
                              // component={Link}
                              // to={`/admin/appointments/` + r.id}
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => onAccept(r)}
                              >
                                <Typography>ACCEPT</Typography>
                              </Button>
                              <Button
                                variant="contained"
                                size="small"
                                color="error"
                                onClick={() => onCancel(r)}
                              >
                                <Typography>CANCEL</Typography>
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
        </Paper>
        </>
    );
}
