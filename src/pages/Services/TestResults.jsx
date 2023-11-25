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
import {
  Add,
  Archive,
  Visibility,
} from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider";
import TestResultModal from "../../components/modals/TestResultModal";

export default function TestResults({sid}) {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [imageData, setImageData] = useState("");
  const [notification, setNotification] = useState("");
  const [message, setMessage] = useState(null);

  const [testresults, setTestresults] = useState([]);
  const [pets, setPets] = useState([]);

  const [testresult, setTestresult] = useState({
    id: null,
    pet_id: null,
    attachment: null,
    description: "",
  });

  const getTestresults = () => {
    setLoading(true);
    axiosClient
      .get(`/testresults/petowner/${id}/service/${sid}`)
      .then(({ data }) => {
        setLoading(false);
        setTestresults(data.data);
      })
      .catch((mes) => {
        const response = mes.response;
        if (response && response.status == 404) {
          setMessage(response.data.message);
        }
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
    { id: "Pet", name: "Pet" },
    { id: "Attachment", name: "Attachment" },
    { id: "Description", name: "Description" },
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
    getPets()
    openchange(true);
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
      getTestresults();
    });
  };

  const onSubmit = () => {
    // ev.preventDefault();
    if (testresult.id) {
      axiosClient
        .put(`/testresults/${testresult.id}`, testresult)
        .then(() => {
          setNotification("Pet was successfully updated");
          openchange(false);
          getTestresults();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      if (!testresult.attachment) {
        setError("Please select an image to upload.");
        return;
      }

      const formData = new FormData();
      formData.append("attachment", testresult.attachment);

      axiosClient
        .post(`/testresults/petowner/${id}/service/${sid}`, testresult, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          setNotification("Test result was successfully saved.");
          openchange(false);
          getTestresults();
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
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/svg+xml",
      ];
      if (allowedTypes.includes(selectedFile.type)) {
        setTestresult((prevImage) => ({
          ...prevImage,
          attachement: selectedFile,
        }));
        setError(null);
      } else {
        setError(
          "The selected file must be of type: jpg, png, jpeg, gif, svg."
        );
      }
    }
  };

  useEffect(() => {
    getTestresults();
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
              onClick={functionopenpopup}
              variant="contained"
              color="success"
              size="small"
            >
              <Add />
            </Button>
          </Box>
          {notification && <Alert severity="success">{notification}</Alert>}

          <TestResultModal
            open={open}
            onClick={closepopup}
            onClose={closepopup}
            onSubmit={onSubmit}
            pets={pets}
            errors={errors}
            testresult={testresult}
            setTestresult={setTestresult}
            isUpdate={testresult.id}
            petid={null}
            handleImage={handleImage}
          />
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
                    <TableCell colSpan={5} style={{ textAlign: "center" }}>
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
                  {testresults &&
                    testresults
                      .slice(page * rowperpage, page * rowperpage + rowperpage)
                      .map((r) => (
                        <TableRow hover role="checkbox" key={r.id}>
                          <TableCell>{r.pet.name}</TableCell>
                          <TableCell>
                            <img
                              src={`http://localhost:8000/` + r.attachement}
                              height="100"
                            />{" "}
                          </TableCell>
                          <TableCell>{r.description}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={2}>
                              <Button
                                variant="contained"
                                color="info"
                                size="small"
                                component={Link}
                                to={`/admin/pets/` + r.id + `/view`}
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
            count={testresults.length}
            component="div"
            onPageChange={handlechangepage}
            onRowsPerPageChange={handleRowsPerPage}
          ></TablePagination>
        </Box>
      </Paper>
    </>
  );
}
