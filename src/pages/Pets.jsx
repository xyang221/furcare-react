import {
    Alert,
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import axiosClient from "../axios-client";
  import { Add, Close, Delete, Edit, Search } from "@mui/icons-material";
  import Navbar from "../components/Navbar";
  import Sidebar from "../components/Sidebar";
import { useParams } from "react-router-dom";
  
  export default function Pets() {
  
    //for table
    const columns = [
      { id: "id", name: "ID" },
      { id: "name", name: "Pet Name" },
      { id: "birthdate", name: "Birthdate" },
      { id: "Gender", name: "Gender" },
      { id: "Breed", name: "Breed" },
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
  
    const { id } = useParams();
    const [petowner, setPetowner] = useState([]);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(false);
  
const getPets = () => {
    setLoading(true);
            
            axiosClient.get(`/petowners/${id}`)
            .then(({ data }) => {
                setLoading(false);
                setPetowner(data);
            })
            .catch(() => {
                setLoading(false);
            });
            console.log(pets)


            axiosClient.get(`/petowners/${id}/pets`)
            .then(({ data }) => {
                setLoading(false);
                setPets(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
}

const getPetdata = () => {
    setLoading(true);
    axiosClient
      .get(`/pets/${petowner.pet.id}`)
      .then(({ data }) => {
        setLoading(false);
        setPet(data);
      })
      .catch(() => {
        setLoading(false);
      });
}
  
    const onDelete = (r) => {
      if (!window.confirm("Are you sure?")) {
        return;
      }
  
      axiosClient.delete(`/roles/${r.id}`).then(() => {
        // setNotification("Role deleted");
        // getRoles();
      });
    };
  
    //for modal
    const [open, openchange] = useState(false);
    const functionopenpopup = (ev) => {
      openchange(true);
      setPet({})
    };
    const closepopup = () => {
      openchange(false);
    };
  
    const [errors, setErrors] = useState(null);
    const [notification, setNotification] = useState("");
    const [modalloading, setModalloading] = useState(false);
    const [pet, setPet] = useState({
        id: null,
        name: "",
        birthdate: "",
        gender: "",
        color: "",
        qr_code: "",
        photo: "",
        breed_id: null,
        petowner_id: null,
      });

      const [selectedGender, setSelectedGender] = useState("");
      const [breed, setBreed] = useState([]);
  
      const getBreeds = () => {
        axiosClient
        .get(`/breeds`)
        .then(({ data }) => {
          setLoading(false);
          setBreed(data.data);
        })
        .catch(() => {
          setLoading(false);
        });
      }
    const onEdit = (r) => {
      setModalloading(true);
      axiosClient
        .get(`/roles/${r.id}`)
        .then(({ data }) => {
          setModalloading(false);
          setPet(data);
        })
        .catch(() => {
          setModalloading(false);
        });
  
      openchange(true);
    };
  
    const onSubmit = (pet) => {
      if (pet.id) {
        axiosClient
          .put(`/pets/${pet.id}`, pet)
          .then(() => {
            setNotification("Pet was successfully updated");
            openchange(false);
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
          .post(`/pets`, pet)
          .then(() => {
            setNotification("Pet was successfully created");
            openchange(false);
            getPets();
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
       
            getPets()
getPetdata()
getBreeds()
    

        }, [id]);
  
    return (
      <>
        {/* <Navbar/> */}
        {/* <Stack direction="row" justifyContent="space-between"> */}
        {/* <Sidebar /> */}
        {/* <Box flex={5} > */}
        <Paper
          sx={{
            minWidth: "10%",
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
            <Typography variant="h4">{petowner.firstname}'s Pets</Typography>
            <Button
              variant="contained"
              size="small"
              onClick={functionopenpopup}
            >
              <Add />
            </Button>
          </Box>
  
          {notification && (<Alert severity="success">{notification} </Alert> )}
  
          <Backdrop open={modalloading} style={{ zIndex: 999 }}>
            <CircularProgress color="inherit" />
          </Backdrop>
  
          {!modalloading && (
            <Dialog
              // fullScreen
              open={open}
              onClose={closepopup}
              fullWidth
              maxWidth="sm"
            >
              {pet.id && (
                <DialogTitle>
                  Update Role
                  <IconButton onClick={closepopup} style={{ float: "right" }}>
                    <Close color="primary"></Close>
                  </IconButton>{" "}
                </DialogTitle>
              )}
  
              {!pet.id && (
                <DialogTitle>
                  New Role
                  <IconButton onClick={closepopup} style={{ float: "right" }}>
                    <Close color="primary"></Close>
                  </IconButton>{" "}
                </DialogTitle>
              )}
  
              <DialogContent>
                {errors && (
                  <Box>
                    {Object.keys(errors).map((key) => (
                      <Alert key={key}>{errors[key][0]}</Alert>
                    ))}
                  </Box>
                )}
                {/* <DialogContentText>Do you want remove this user?</DialogContentText> */}
                <Stack spacing={2} margin={2}>
                <Select
                    label="Role"
                    value={pet.petowner_id}
                    onChange={(ev) =>
                      setPet({ ...pet, petowner_id: ev.target.value })
                    }
                  >
                    {petowner.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                         {`${item.firstname} ${item.lastname}`}
                      </MenuItem>
                    ))}
                  </Select>
                  <TextField
                    variant="outlined"
                    id="Description"
                    label="Description"
                    value={pet.photo}
                    onChange={(ev) =>
                      setPet({ ...pet, photo: ev.target.value })
                    }
                  />
                   <TextField
                    variant="outlined"
                    id="Description"
                    label="Description"
                    value={pet.name}
                    onChange={(ev) => setPet({ ...pet, name: ev.target.value })}
                  />

<Select
                    label="Gender"
                    value={pet.gender || ''}
                    onChange={(ev) =>
                      setPet({ ...pet, gender: ev.target.value })
                    }
                  >
                    <MenuItem></MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                  <TextField
                    variant="outlined"
                    id="Description"
                    label="Description"
                    value={pet.color}
                    onChange={(ev) =>
                      setPet({ ...pet, color: ev.target.value })
                    }
                  />
                   
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => onSubmit(pet)}
                  >
                    Save
                  </Button>
                </Stack>
              </DialogContent>
              <DialogActions>
                {/* <Button color="success" variant="contained">Yes</Button>
                      <Button onClick={closepopup} color="error" variant="contained">Close</Button> */}
              </DialogActions>
            </Dialog>
          )}
  
          <TableContainer sx={{ height: 380,  }}>
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
                    <TableCell colSpan={4} style={{ textAlign: "center" }}>
                      Loading...
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
  
              {!loading && (
                <TableBody>
                  {pets &&
                    pets
                      .slice(page * rowperpage, page * rowperpage + rowperpage)
                      .map((r) => (
                        <TableRow hover role="checkbox" key={r.id}>
                          <TableCell>{r.id}</TableCell>
                          <TableCell>{r.name}</TableCell>
                          <TableCell>{r.birthdate}</TableCell>
                          <TableCell>{r.gender}</TableCell>
                          <TableCell>{r.breed.breed}</TableCell>
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
                                color="error"
                                size="small"
                                onClick={() => onDelete(r)}
                              >
                                <Delete fontSize="small" />
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
        {/* </Box> */}
        {/* </Stack> */}
      </>
    );
  };
  