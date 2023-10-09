import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link, useParams } from "react-router-dom";
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

export default function Staffs() {

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
      const [notification, setNotification] = useState("");

    const { id } = useParams();
    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(false);

    const getstaffs = () => {

        document.title = "Staffs";
        
        setLoading(true);
        axiosClient.get('/staffs')
            .then(({ data }) => {
                setLoading(false);
                setStaffs(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const onDelete = (po) => {
        if (!window.confirm("Are you sure?")) {
            return;
        }

        axiosClient.delete(`/staffs/${po.id}`).then(() => {
            setNotification("Pet Owner deleted");
            getstaffs();
        });
    };

    useEffect(() => {
        if (id) {
            setLoading(true);
            axiosClient.get(`/staffs/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setStaffs(data);
                })
                .catch(() => {
                    setLoading(false);
                });
    }

        }, [id]);

    useEffect(() => {
        getstaffs();
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
            <Typography variant="h4">Staffs</Typography>{" "}
            <Button
            component={Link}
            to={"admin/staffs/new"}
            variant="contained"
            size="small"
          >
            <Add />
            <Typography fontSize="12px"> Staff</Typography>
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
                  {staffs &&
                    staffs
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
                              to={`/admin/staffs/` + r.id}
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
            count={staffs.length}
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
