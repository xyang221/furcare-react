import React, { useEffect, useState } from "react";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
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
import { Add, Archive, Delete, Edit, OpenInNew, Search, Visibility } from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import PetsModal from "../components/modals/PetsModal";
import DropDownButtons from "../components/DropDownButtons";
import { SearchPetOwner } from "../components/SearchPetOwner";

export default function Pets() {
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
    petowner_id:null,
    // photo: imageData,
    photo: null,
    breed_id: null,
  });

  const [breeds, setBreeds] = useState([]);

  const getBreeds = () => {
    axiosClient
      .get(`/breeds`)
      .then(({ data }) => {
        setBreeds(data.data);
      })
      .catch(() => {
      });
  };

  const [pets, setPets] = useState([]);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");

  const getPets = () => {
    setMessage(null);
    setLoading(true);
    axiosClient
      .get(`/pets`)
      .then(({ data }) => {
        setLoading(false);
        setPets(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
        setLoading(false);
      });
  };

  const [petowners, setPetowners] = useState([]);

  const getPetowners = () => {
    setLoading(true);
    axiosClient
      .get(`/petowners`)
      .then(({ data }) => {
        setLoading(false);
        setPetowners(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  //for table
  const columns = [
    { id: "Photo", name: "Photo" },
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
  const [petownerid, setPetownerid] = useState(true);

  const functionopenpopup = (ev) => {
    getBreeds();
    getPetowners()
    setPetownerid(true)
    openchange(true);
    setPet({});
    setErrors(null);
  };

  const closepopup = () => {
    openchange(false);
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

      if (!pet.photo) {
        setError("Please select an image to upload.");
        return;
      }
  
      const formData = new FormData();
      formData.append("photo", pet.photo);

      axiosClient
        .post(`/petowners/${pet.petowner_id}/addpet`, pet, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        } )
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

  const [error, setError] = useState(null);

  const handleImage = (e) => {
    const selectedFile = e.currentTarget.files?.[0] || null;

    if (selectedFile) {
      // Validate the file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"];
      if (allowedTypes.includes(selectedFile.type)) {
        setPet((prevImage) => ({
          ...prevImage,
          photo: selectedFile,
        }));
        setError(null);
      } else {
        setError("The selected file must be of type: jpg, png, jpeg, gif, svg.");
      }
    }
  };

  const search = (query) => {
    if(query){
    setMessage(null);
    setPets([])
      setLoading(true);
      axiosClient
        .get(`/pets-search/${query}`)
        .then(({ data }) => {
          setLoading(false);
          setPets(data.data);
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 404) {
            setMessage(response.data.message);
          }
          setLoading(false);
        });
      }
  }

  useEffect(() => {
    if(!query){
    getPets();
    }
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
            title="Pets"
            optionLink1="/admin/pets/archives"
            optionLabel1="Archives"
          />
          <Button
          onClick={functionopenpopup}
          variant="contained"
          size="small"
        >
          <Add/>
        </Button>
        <SearchPetOwner query={query} setQuery={setQuery} search={search} getPetowners={getPets}/>

          </Box>
          
            {notification && <Alert severity="success">{notification}</Alert>}

            <PetsModal
              open={open}
              onClick={closepopup}
              onClose={closepopup}
              // id={petdata.id}
              setImageData={setImageData}
              onSubmit={onSubmit}
              // loading={loading}
              breeds={breeds}
              pet={pet}
              setPet={setPet}
              petowners={petowners}
              errors={errors}
              isUpdate={pet.id}
              selectPetowner={petownerid}
              addImage={true}
              handleImage={handleImage}
              error={error}
              
            />
<Divider/>
            <TableContainer sx={{ height: 350 }}>
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
                    {pets &&
                      pets
                        .slice(
                          page * rowperpage,
                          page * rowperpage + rowperpage
                        )
                        .map((r) => (
                          <TableRow hover role="checkbox" key={r.id}>
                            {/* <TableCell  ><img  src={`http://127.0.0.1:8000/${r.photo}`}/>  </TableCell> */}
                           <TableCell>  <img src={`http://localhost:8000/` + r.photo} height="100"/> </TableCell>
                            {/* <TableCell>  </TableCell> */}
                            <TableCell>{r.id}</TableCell>
                            <TableCell>{r.name}</TableCell>
                            <TableCell>{r.gender}</TableCell>
                            <TableCell>{r.breed.breed}</TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={2}>
                              <Button
                                  variant="contained"
                                  color="info"
                                  size="small"
                                  component={Link}
                                  to={`/admin/pets/` + r.id +`/view`}
                                >
                                  <OpenInNew fontSize="small" />
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
              count={pets.length}
              component="div"
              onPageChange={handlechangepage}
              onRowsPerPageChange={handleRowsPerPage}
            ></TablePagination>
          </Paper>
    </>
  );
}
