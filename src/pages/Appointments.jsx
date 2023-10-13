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
  import {
      Add,
      Archive,
    Edit,
  } from "@mui/icons-material";

export default function Appointments() {

  //for table
    const columns = [
        { id: "Date", name: "Date" },
        { id: "client", name: "Client" },
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
        axiosClient.get('/appointments')
            .then(({ data }) => {
                setLoading(false);
                setAppointments(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
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

  //for modal
  const [errors, setErrors] = useState(null);
  const [modalloading, setModalloading] = useState(false);
  const [user, setUser] = useState({
    id: null,
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: null,
   
  });
  const [open, openchange] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const addModal = (ev) => {
    setOpenAdd(true);
    setUser({})
    setErrors(null);
  };

  const closepopup = () => {
    openchange(false);
    setOpenAdd(false)
  };

  const onEdit = (r) => {
    setErrors(null)
    setModalloading(true);
    axiosClient
      .get(`/users/${r.id}`)
      .then(({ data }) => {
        setModalloading(false);
        setUser(data);
      })
      .catch(() => {
        setModalloading(false);
      });
    openchange(true);
  };
  

  const onSubmit = () => {
    if (user.id) {
      axiosClient
        .put(`/users/${user.id}`, user)
        .then(() => {
          setNotification("User was successfully updated");
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
        .post(`/users`, user)
        .then(() => {
          setNotification("User was successfully created");
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
            <Typography variant="h4">Appointments</Typography>{" "}
            <Button
             component={Link}
             to={"/admin/appointments/new"}
            variant="contained"
            size="small"
          >
            <Add />
          </Button>
          </Box>
    
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
                        <TableCell>{`${r.firstname} ${r.lastname}`}</TableCell>
                          <TableCell>{r.purpose}</TableCell>
                          <TableCell>{r.status}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={2}>
                              <Button
                              component={Link}
                              to={`/admin/appointments/` + r.id}
                                variant="contained"
                                color="info"
                                size="small"
                                // onClick={() => onRestore(r)}
                              >
                                <Edit fontSize="small" />
                              </Button>
                              <Button
                                variant="contained"
                                size="small"
                                color="error"
                                // onClick={() => onDelete(r)}
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
            count={appointments.length}
            component="div"
            onPageChange={handlechangepage}
            onRowsPerPageChange={handleRowsPerPage}
          ></TablePagination>
        </Paper>
        </>
    );
}
