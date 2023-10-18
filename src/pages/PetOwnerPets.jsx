import React, { useEffect, useState } from "react";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
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
import { Add, Archive, Delete, Edit, Search } from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import PetsModal from "../components/modals/PetsModal";

export default function PetOwnerPets() {
  const { id } = useParams();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [imageData, setImageData] = useState("");
  const [notification, setNotification] = useState("");


  const [pet, setPet] = useState({
    id: null,
    name: "",
    birthdate: "",
    gender: "",
    color: "",
    qr_code: "",
    photo: imageData,
    breed_id: null,
  });

  const [breeds, setBreeds] = useState([]);

  const getBreeds = () => {
    setLoading(true);
    axiosClient
      .get(`/breeds`)
      .then(({ data }) => {
        setLoading(false);
        setBreeds(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getPets = () => {
    setLoading(true);
    axiosClient
      .get(`/petowners/${id}/pets`)
      .then(({ data }) => {
        setLoading(false);
        setPets(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  //for table
  const columns = [
    // { id: "photo", name: "photo" },
    { id: "id", name: "ID" },
    { id: "name", name: "Pet Name" },
    { id: "email", name: "Gender" },
    { id: "breed", name: "Breed" },
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

  //for modal

  const [open, openchange] = useState(false);

  const functionopenpopup = (ev) => {
    // openchange(true);
    openchange(true);
    setPet({});
    setErrors(null);
  };

  const closepopup = () => {
    openchange(false);
  };

  const onEdit = (r) => {
    setLoading(true);
    axiosClient
      .get(`/pets/${r.id}`)
      .then(({ data }) => {
        setLoading(false);
        setPet(data);
      })
      .catch(() => {
        setLoading(false);
      });
    openchange(true);
  };

  const onArchive = (u) => {
    if (!window.confirm("Are you sure to archive this pet?")) {
      return;
    }

    axiosClient.delete(`/pets/${u.id}/archive`).then(() => {
      setNotification("Pet was archived");
      getPets();
    });
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (pet.id) {
      axiosClient
        .put(`/pets/${pet.id}`, pet)
        .then(() => {
          setNotification("Pet was successfully updated");
          openchange(false)
          getPets();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/petowners/${id}/addpet`, pet)
        .then(() => {
          setNotification("Pet was successfully added");
          openchange(false)
          getPets();
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
    getPets();
    getBreeds();
  }, []);

  return (
    <Box>
      {/* <Navbar /> */}
      <Stack direction="row" justifyContent="space-between">
        {/* <Sidebar /> */}
        <Box flex={5}>
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
              <Typography variant="h4">My Pets</Typography>{" "}

              <Button
            component={Link}
            to={`/admin/pets/archives`}
            variant="contained"
            size="small"
          >
            <Typography>Archives</Typography>
          </Button>

              <Button
                onClick={functionopenpopup}
                variant="contained"
              >
                <Add />
              </Button>
            </Box>

            {notification && <Alert severity="success">{notification}</Alert>}

            {/* <Backdrop open={loading} style={{ zIndex: 999 }}>
          <CircularProgress color="inherit" />
        </Backdrop> */}

            <PetsModal
              open={open}
              onClick={closepopup}
              onClose={closepopup}
              // id={petdata.id}
              setImageData={setImageData}
              onSubmit={onSubmit}
              loading={loading}
              breeds={breeds}
              pet={pet}
              setPet={setPet}
              errors={errors}
              isUpdate={pet.id}
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
                      <TableCell colSpan={5} style={{ textAlign: "center" }}>
                        Loading...
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}

                {!loading && (
                  <TableBody>
                    {pets &&
                      pets
                        .slice(
                          page * rowperpage,
                          page * rowperpage + rowperpage
                        )
                        .map((r) => (
                          <TableRow hover role="checkbox" key={r.id}>
                            {/* <TableCell  ><img  src={`http://127.0.0.1:8000/${r.photo}`}/>  </TableCell> */}
                            <TableCell>{r.id}</TableCell>
                            <TableCell>{r.name}</TableCell>
                            <TableCell>{r.gender}</TableCell>
                            <TableCell>{r.breed.breed}</TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={2}>
                                <Button
                                  onClick={() => onEdit(r)}
                                  variant="contained"
                                  size="small"
                                  color="info"
                                >
                                  <Edit fontSize="small" />
                                </Button>

                                <Button
                                  variant="contained"
                                  color="error"
                                  size="small"
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
              count={pets.length}
              component="div"
              onPageChange={handlechangepage}
              onRowsPerPageChange={handleRowsPerPage}
            ></TablePagination>
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
}
