import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    CssBaseline,
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
  import Navbar from "../components/Navbar";
  import Sidebar from "../components/Sidebar";

export default function PetOwners() {

  //for table
    const columns = [
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
    
      const [users, setUsers] = useState([]);
      const [loading, setLoading] = useState(false);
      const [notification, setNotification] = useState("");
    const [petowners, setPetowners] = useState([]);


    const getPetowners = () => {

        document.title = "Pet Owners";
        
        setLoading(true);
        axiosClient.get('/petowners')
            .then(({ data }) => {
                setLoading(false);
                setPetowners(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const onDelete = (po) => {
        if (!window.confirm("Are you sure?")) {
            return;
        }

        axiosClient.delete(`/petowners/${po.id}`).then(() => {
            setNotification("Pet Owner deleted");
            getPetowners();
        });
    };

    useEffect(() => {
        getPetowners();
    }, []);

    return (
        <>
        <CssBaseline/>
            {/* <Navbar/> */}
            <Stack direction="row" justifyContent="space-between">
                 {/* <Sidebar /> */}
                 <Box flex={5} >
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
            <Typography variant="h4">Pet Owners</Typography>{" "}
            <Button
            component={Link}
            to={"/admin/petowners/new"}
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
                  {petowners &&
                    petowners
                      .slice(page * rowperpage, page * rowperpage + rowperpage)
                      .map((r) => (
                        <TableRow hover role="checkbox" key={r.id}>
                          <TableCell>{r.id}</TableCell>
                        <TableCell>{`${r.firstname} ${r.lastname}`}</TableCell>
                          <TableCell>{r.contact_num}</TableCell>
                          <TableCell>{r.address.zone}, {r.address.barangay}, {r.address.zipcode.area}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={2}>
                              <Button
                              component={Link}
                              to={`/admin/petowners/` + r.id}
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
            count={petowners.length}
            component="div"
            onPageChange={handlechangepage}
            onRowsPerPageChange={handleRowsPerPage}
          ></TablePagination>
        </Paper>
        </Box>
        </Stack>
        </>
    );
}
