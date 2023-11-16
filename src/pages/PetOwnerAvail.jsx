import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
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
  import {
    NavigateNext,
  } from "@mui/icons-material";

export default function PetOwnerAvail() {

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
    
      const [loading, setLoading] = useState(false);
      const [notification, setNotification] = useState("");
    const [petowners, setPetowners] = useState([]);

    const getPetowners = () => {

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

    useEffect(() => {
        getPetowners();
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
            <Typography variant="h4">Pet Owners</Typography>{" "}
            
          </Box>

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
                              to={`/admin/services/petowners/` + r.id + `/avail`}
                                variant="contained"
                                color="info"
                                size="small"
                              >
                                <NavigateNext fontSize="small" />
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
        </>
    );
}
