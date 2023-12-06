import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link, useParams } from "react-router-dom";
import {
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
} from "@mui/material";
import { Add, Archive, Close, Done, DoneAll, Edit } from "@mui/icons-material";
import EditAppointment from "../components/modals/EditAppointment";
import DropDownButtons from "../components/DropDownButtons";
import { SearchPetOwner } from "../components/SearchPetOwner";
import Notif from "../components/Notif";
import { useStateContext } from "../contexts/ContextProvider";

export default function Appointments() {
  //for table
  const columns = [
    { id: "Date", name: "Date" },
    { id: "client", name: "Client" },
    { id: "Service", name: "Service" },
    { id: "Purpose", name: "Purpose" },
    { id: "Remarks", name: "Remarks" },
    { id: "Status", name: "Status" },
    { id: "Actions", name: "Actions" },
  ];

  const petownerscolumns = [
    { id: "id", name: "ID" },
    { id: "name", name: "Name" },
    { id: "contact_num", name: "Contact Number" },
    { id: "address", name: "Address" },
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

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [petowners, setPetowners] = useState([]);
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState("");

  //for notif modal
  const [opennotif, setOpennotif] = useState(false);
  const {notification,setNotification} = useStateContext();
  // const [notification, setNotification] = useState("");

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
  });

  const [petowner, setPetowner] = useState({
    id: null,
    firstname: "",
    lastname: "",
  });
  const [petownerid, setPetownerid] = useState(null);
  const [open, openchange] = useState(false);

  const getAppointments = () => {
    setPetownerid(null)
    setPetowners([])
    setMessage(null);
    setLoading(true);
    axiosClient
      .get("/appointments/bydate")
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

  const search = (query) => {
    if (query) {
      setMessage(null);
      setPetowners([]);
      setLoading(true);
      axiosClient
        .get(`/petowners-search/${query}`)
        .then(({ data }) => {
          setLoading(false);
          setPetowners(data.data);
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 404) {
            setMessage(response.data.message);
          }
          setLoading(false);
        });
    }
  };

  //for modal

  const addModal = (p) => {
    getServices();
    setPetownerid(p.id);
    setAppointment({});
    setErrors(null);
    setNotification("");
    openchange(true);
  };

  const closepopup = () => {
    openchange(false);
  };

  //buttons
  const onDone = (r) => {
    if (!window.confirm("Are you sure this appointment was completed?")) {
      return;
    }

    axiosClient.put(`/appointments/${r.id}/completed`).then(() => {
      setNotification("The appointment was completed");
      getAppointments();
    });
  };

  const onNoShow = (r) => {
    if (!window.confirm("Are you sure the petowner didn't show up?")) {
      return;
    }

    axiosClient.put(`/appointments/${r.id}/noshow`).then(() => {
      setNotification("The appointment was not made");
      getAppointments();
    });
  };

  const onEdit = (r) => {
    setErrors(null);
    getServices();
    setModalloading(true);
    axiosClient
      .get(`/appointments/${r.id}`)
      .then(({ data }) => {
        setModalloading(false);
        setAppointment(data);
        setPetowner(data.petowner)
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
          setNotification("Appointment was successfully updated.");
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
        .post(`/appointments/petowner/${petownerid}`, appointment)
        .then(() => {
          setNotification("Appointment was successfully saved.");
          openchange(false);
          setOpennotif(true);
          getAppointments();
          setQuery("");
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

  console.log(petownerid)

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
          p={1}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <DropDownButtons
            title="Appointments"
            optionLink1="/admin/appointments/pending"
            optionLabel1="Pending"
            optionLink2="/admin/appointments/confirmed"
            optionLabel2="Confirmed"
            optionLink3="/admin/appointments/completed"
            optionLabel3="Completed"
          />

          <SearchPetOwner
            query={query}
            setQuery={setQuery}
            search={search}
            getPetowners={getAppointments}
          />
        </Box>

        <EditAppointment
          open={open}
          onClose={closepopup}
          onClick={closepopup}
          onSubmit={onSubmit}
          loading={modalloading}
          petowner={petowner}
          petowners={petowners}
          services={services}
          appointment={appointment}
          setAppointment={setAppointment}
          errors={errors}
          isUpdate={appointment.id}
          petownerid={petownerid || null}
        />

        <TableContainer sx={{ height: 380 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              {!query ? (
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
              ) : (
                <TableRow>
                  {petownerscolumns.map((column) => (
                    <TableCell
                      style={{ backgroundColor: "black", color: "white" }}
                      key={column.id}
                    >
                      {column.name}
                    </TableCell>
                  ))}
                </TableRow>
              )}
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

            {!loading && !query && (
              <TableBody>
                {appointments &&
                  appointments
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>
                          {new Date(r.date).toISOString().split("T")[0]}
                        </TableCell>
                        <TableCell>{`${r.petowner.firstname} ${r.petowner.lastname}`}</TableCell>
                        <TableCell>{r.service.service}</TableCell>
                        <TableCell>{r.purpose}</TableCell>
                        <TableCell>{r.remarks}</TableCell>
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
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() => onNoShow(r)}
                            >
                              <Close fontSize="small" />
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            )}
            {query && petowners && (
              <TableBody>
                {petowners &&
                  petowners
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((p) => (
                      <TableRow hover role="checkbox" key={p.id}>
                        <TableCell>{p.id}</TableCell>
                        <TableCell>{`${p.firstname} ${p.lastname}`}</TableCell>
                        <TableCell>0{p.contact_num}</TableCell>
                        <TableCell>
                          {p.address.zone}, {p.address.barangay},{" "}
                          {p.address.zipcode.area}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => addModal(p)}
                          >
                            <Add fontSize="small" />
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
          count={appointments.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
        <Notif open={opennotif} notification={notification} />
      </Paper>
    </>
  );
}
