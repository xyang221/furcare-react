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
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import {
  DeleteForever,
  RestoreFromTrash,
} from "@mui/icons-material";
import { useStateContext } from "../contexts/ContextProvider";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Roles = () => {
  const columns = [
    { id: "id", name: "ID" },
    { id: "name", name: "Username" },
    { id: "email", name: "Email" },
    { id: "deleteddate", name: "Deleted Date" },
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

  const getArchivedUsers = () => {
    setLoading(true);
    axiosClient
      .get("/archives/users")
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onRestore = (u) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }

    axiosClient.put(`/users/${u.id}/restore`).then(() => {
      setNotification("User was successfully restored");
      getArchivedUsers();
    });
  };

  const onDelete = (r) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }

    axiosClient.delete(`/archives/${r.id}/forcedelete`).then(() => {
      setNotification("User was permanently deleted");
      return <Alert severity="success">User was deleted</Alert>
      getArchivedUsers();
    });
  };

  useEffect(() => {
    getArchivedUsers();
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
     
      <Box
        p={2}
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Typography variant="h4">Archived Users</Typography>{" "}
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
              {users &&
                users
                  .slice(page * rowperpage, page * rowperpage + rowperpage)
                  .map((r) => (
                    <TableRow hover role="checkbox" key={r.id}>
                      <TableCell>{r.id}</TableCell>
                      <TableCell>{r.username}</TableCell>
                      <TableCell>{r.email}</TableCell>
                      <TableCell>{r.deleted_at}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={2}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => onRestore(r)}
                          >
                            <RestoreFromTrash fontSize="small" />
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={() => onDelete(r)}
                          >
                            <DeleteForever fontSize="small" />
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
        count={users.length}
        component="div"
        onPageChange={handlechangepage}
        onRowsPerPageChange={handleRowsPerPage}
      ></TablePagination>
    </Paper>
    </Box>
    </Stack>
    </>
  );
};

export default Roles;
