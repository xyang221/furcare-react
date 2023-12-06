import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
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

import DropDownButtons from "../components/DropDownButtons";
import { Close, Done } from "@mui/icons-material";
import Notif from "../components/Notif";

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
  const [opennotif, setOpennotif] = useState(false);
  const [message, setMessage] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAppointments = () => {
    setMessage(null)
    setLoading(true);
    axiosClient
      .get("/appointments/pending")
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

  const onAccept = (r) => {
    if (!window.confirm("Are you sure to confirm this appointment?")) {
      return;
    }

    axiosClient.put(`/appointments/${r.id}/confirm`).then(() => {
      setNotification(`The appointment of ${r.petowner.firstname} ${r.petowner.lastname} was confirmed`);
      setOpennotif(true);
      getAppointments();
    });
  };

  const onCancel = (r) => {
    if (!window.confirm("Are you sure to cancel this appointment?")) {
      return;
    }

    axiosClient.put(`/appointments/${r.id}/cancel`).then(() => {
      setNotification(
        `The appointment of ${r.petowner.firstname} ${r.petowner.lastname} was cancelled`
      );
      setOpennotif(true);
      getAppointments();
    });
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
            title="Pending Appointments"
            optionLink1="/admin/appointments/confirmed"
            optionLabel1="Confirmed"
            optionLink2="/admin/appointments/completed"
            optionLabel2="Completed"
            optionLink3="/admin/appointments"
            optionLabel3="Scheduled"
          />
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
                  <TableCell colSpan={6} style={{ textAlign: "center" }}>
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
                {appointments &&
                  appointments
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        {/* <TableCell>{r.date}</TableCell> */}
                        <TableCell>
                          {new Date(r.date).toISOString().split("T")[0]}
                        </TableCell>
                        <TableCell>{`${r.petowner.firstname} ${r.petowner.lastname}`}</TableCell>
                        <TableCell>{r.purpose}</TableCell>
                        <TableCell>{r.service.service}</TableCell>
                        <TableCell>{r.status}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => onAccept(r)}
                            >
                              <Done fontSize="small" />
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() => onCancel(r)}
                            >
                              <Close fontSize="small" />
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
        <Notif open={opennotif} notification={notification} />
      </Paper>
    </>
  );
}
