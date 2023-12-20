import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
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
} from "@mui/material";
import {
  Archive,
  OpenInNew,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import DropDownButtons from "../components/DropDownButtons";
import { SearchPetOwner } from "../components/SearchPetOwner";

export default function Pets() {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

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

  const onArchive = (u) => {
    if (!window.confirm("Are you sure to archive this pet?")) {
      return;
    }

    axiosClient.delete(`/pets/${u.id}/archive`).then(() => {
      setNotification("Pet was archived");
      getPets();
    });
  };

  const search = (query) => {
    if (query) {
      setMessage(null);
      setPets([]);
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
  };

  useEffect(() => {
    if (!query) {
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
       
          <SearchPetOwner
            query={query}
            setQuery={setQuery}
            search={search}
            getPetowners={getPets}
          />
        </Box>

        {notification && <Alert severity="success">{notification}</Alert>}

        <Divider />
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
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((r) => (
                      <TableRow hover role="checkbox" key={r.id}>
                        <TableCell>
                          <img
                            src={`http://localhost:8000/` + r.photo}
                            height="100"
                          />{" "}
                        </TableCell>
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
                              to={`/admin/pets/` + r.id + `/view`}
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
