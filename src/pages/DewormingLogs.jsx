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
import DewormingLogsModal from "../components/modals/DewormingLogsModal";

export default function DewormingLogs() {
  //for table
  const columns = [
    { id: "id", name: "ID" },
    { id: "date", name: "Date" },
    { id: "weight", name: "Weight" },
    { id: "Description", name: "Description" },
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

  const [deworminglogs, setDeworminglogs] = useState([]);

  const { id } = useParams();

  const getDeworming = () => {
    setLoading(true);
    axiosClient
      .get(`/deworminglogs/pet/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setDeworminglogs(data);
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

  const [deworminglog, setDeworminglog] = useState({
    id: null,
    date: "",
    weight: null,
    description: "",
    administered: "",
    status: "",
    pet_id:null,
  });

  const [openAdd, setOpenAdd] = useState(false);
  const addModal = (ev) => {
    getPets();
    setOpenAdd(true);
    setDeworminglog({});
    setErrors(null);
  };

  const closepopup = () => {
    setOpenAdd(false);
  };

  const onArchive = (u) => {
    if (!window.confirm("Are you sure to archive this?")) {
      return;
    }

    axiosClient.delete(`/deworminglogs/${u.id}/archive`).then(() => {
      setNotification("Pet Owner was archived");
      getDeworming();
    });
  };

  const onSubmit = () => {
    if (deworminglog.id) {
      axiosClient
        .put(`/deworminglogs/${deworminglog.id}`, deworminglog)
        .then(() => {
          setNotification("deworminglog was successfully updated");
          openAdd(false);
          getDeworming();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/deworminglog`, deworminglog)
        .then(() => {
          setNotification("deworminglog was successfully created");
          setOpenAdd(false);
          getDeworming();
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
    getDeworming();
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

        <DewormingLogsModal
          open={openAdd}
          onClose={closepopup}
          onClick={closepopup}
          onSubmit={onSubmit}
          loading={loading}
          pets={pets}
          deworminglog={deworminglog}
          setDeworminglog={setDeworminglog}
          // errors={errors}
          petid={id}
          isUpdate={deworminglog.id}
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
                        <TableCell>{r.id}</TableCell>
                        <TableCell>{`${r.firstname} ${r.lastname}`}</TableCell>
                        <TableCell>{r.contact_num}</TableCell>
                        <TableCell>
                          {r.address.zone}, {r.address.barangay},{" "}
                          {r.address.zipcode.area}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2}>
                            <Button
                              component={Link}
                              to={`/admin/deworminglogs/` + r.id + `/view`}
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
          count={deworminglogs.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Box>
    </>
  );
}
