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
import { Add, Archive, Edit, Visibility } from "@mui/icons-material";
import DewormingLogsModal from "../components/modals/DewormingLogsModal";

export default function PetDeworming() {
  const { id } = useParams();

  //for table
  const columns = [
    { id: "date", name: "Date" },
    { id: "weight", name: "Weight" },
    { id: "Description", name: "Description" },
    { id: "Administered", name: "Administered" },
    { id: "Return", name: "Return" },
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
  const [deworminglog, setDeworminglog] = useState({
    id: null,
    weight: null,
    description: "",
    administered: "",
    return: "",
    pet_id: null,
  });
  const [pet, setPet] = useState([]);
  const [open, setOpen] = useState(false);
  const [deworminglogs, setDeworminglogs] = useState([]);

  const getDeworming = () => {
    setMessage(null)
    setLoading(true);
    axiosClient
      .get(`/deworminglogs/pet/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setDeworminglogs(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const closepopup = () => {
    setOpen(false);
  };

  const onEdit = (r) => {
    setErrors(null);
    setLoading(true);
    axiosClient
      .get(`/deworminglogs/${r.id}`)
      .then(({ data }) => {
        setLoading(false);
        setDeworminglog(data);
        setPet(data.pet)
      })
      .catch(() => {
        setLoading(false);
      });
    setOpen(true);
  };

  const onArchive = (r) => {
    if (!window.confirm("Are you sure to archive this?")) {
      return;
    }

    axiosClient.delete(`/deworminglogs/${r.id}/archive`).then(() => {
      setNotification("Pet Owner was archived");
      getDeworming();
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (deworminglog.id) {
      axiosClient
        .put(`/deworminglogs/${deworminglog.id}`, deworminglog)
        .then(() => {
          setNotification("Deworming was successfully updated.");
          setOpen(false);
          getDeworming();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  useEffect(() => {
    getDeworming();
  }, []);

  return (
    <>
      <Paper
        sx={{
          minWidth: "90%",
          padding: "10px",
        }}
      >

        <DewormingLogsModal
          open={open}
          onClose={closepopup}
          onClick={closepopup}
          onSubmit={onSubmit}
          loading={loading}
          deworminglog={deworminglog}
          setDeworminglog={setDeworminglog}
          errors={errors}
          pets={pet}
          pet={pet}
          isUpdate={deworminglog.id || null}
        />

        {/* <Button
            component={Link}
            to={`/admin/deworminglogs/archives`}
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
                {deworminglogs &&
                  deworminglogs
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>{`${r.weight} kg`}</TableCell>
                        <TableCell>{r.description}</TableCell>
                        <TableCell>{r.administered}</TableCell>
                        <TableCell>{r.return}</TableCell>
                        <TableCell>{r.servicesavailed.status}</TableCell>
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
          count={deworminglogs.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
    </>
  );
}
