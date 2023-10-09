import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import Navbar from "../components/Navbar";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputLabel,
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
import Sidebar from "../components/Sidebar";
import { Add, Archive, Close, Delete, Edit } from "@mui/icons-material";

export default function Users() {
  //for table
  const columns = [
    { id: "id", name: "ID" },
    { id: "name", name: "Username" },
    { id: "email", name: "Email" },
    // { id: "Created Date", name: "Created Date" },
    { id: "Role", name: "Role" },
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

  const getUsers = () => {
    setLoading(true);
    axiosClient
      .get("/users")
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onDelete = (u) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }

    axiosClient.delete(`/users/${u.id}/archive`).then(() => {
      setNotification("User was archived");
      getUsers();
    });
  };

  const [roles, setRoles] = useState([]);

  const getRoles = () => {
    document.title = "Pet Owners";

    setLoading(true);
    axiosClient
      .get("/roles")
      .then(({ data }) => {
        setLoading(false);
        setRoles(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  //for modal
  const [errors, setErrors] = useState(null);
  const [modalloading, setModalloading] = useState(false);
  const [user, setUser] = useState({
    id: null,
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: null,
  });
  const [open, openchange] = useState(false);

  const functionopenpopup = (ev) => {
    openchange(true);
    setUser({});
    setErrors(null);
  };

  const closepopup = () => {
    openchange(false);
  };

  const onEdit = (r) => {
    setModalloading(true);
    axiosClient
      .get(`/users/${r.id}`)
      .then(({ data }) => {
        setModalloading(false);
        setUser(data);
      })
      .catch(() => {
        setModalloading(false);
      });

    openchange(true);
  };

  const onSubmit = (user) => {
    if (user.id) {
      axiosClient
        .put(`/users/${user.id}`, user)
        .then(() => {
          setNotification("User was successfully updated");
          openchange(false);
          getUsers();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/users`, user)
        .then(() => {
          setNotification("User was successfully created");
          openchange(false);
          getUsers();
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
    getUsers();
    getRoles();
  }, []);

  return (
    <>
      {/* <CssBaseline/> */}
      {/* <Navbar/> */}
      {/* <Stack direction="row" justifyContent="space-between"> */}
      {/* <Sidebar /> */}
      {/* <Box flex={5} > */}
      <Paper
        sx={{
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
          <Typography variant="h4">Users</Typography>{" "}
          <Button onClick={functionopenpopup} variant="contained" size="small">
            <Add />
          </Button>
        </Box>

        {notification && <Alert severity="success">{notification}</Alert>}

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
            {user.id && (
              <DialogTitle>
                Update User
                <IconButton onClick={closepopup} style={{ float: "right" }}>
                  <Close color="primary"></Close>
                </IconButton>{" "}
              </DialogTitle>
            )}

            {!user.id && (
              <DialogTitle>
                New User
                <IconButton onClick={closepopup} style={{ float: "right" }}>
                  <Close color="primary"></Close>
                </IconButton>{" "}
              </DialogTitle>
            )}

            <DialogContent>
              {errors && (
                <Box>
                  {Object.keys(errors).map((key) => (
                    <Alert severity="error" key={key}>
                      {errors[key][0]}
                    </Alert>
                  ))}
                </Box>
              )}
              {/* <DialogContentText>Do you want remove this user?</DialogContentText> */}
              <Stack spacing={2} margin={2}>
                {/* <InputLabel id="demo-select-small-label">Role</InputLabel> */}
                {user.role_id && (
                  <Select
                    label="Role"
                    value={user.role_id || ""}
                    // onChange={(ev) =>
                    //   setUser({ ...user, role_id: ev.target.value })
                    // }
                    disabled
                  >
                    {roles.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.role}
                      </MenuItem>
                    ))}
                  </Select>
                )}

                {!user.role_id && (
                  <Select
                    label="Role"
                    value={user.role_id || ""}
                    onChange={(ev) =>
                      setUser({ ...user, role_id: ev.target.value })
                    }
                  >
                    {roles.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.role}
                      </MenuItem>
                    ))}
                  </Select>
                )}

                <TextField
                  variant="outlined"
                  id="Username"
                  label="Username"
                  value={user.username}
                  onChange={(ev) =>
                    setUser({ ...user, username: ev.target.value })
                  }
                />
                <TextField
                  variant="outlined"
                  id="Email"
                  label="Email"
                  type="email"
                  value={user.email}
                  onChange={(ev) =>
                    setUser({ ...user, email: ev.target.value })
                  }
                />
                <TextField
                  variant="outlined"
                  id="Password"
                  label="Password"
                  type="password"
                  value={user.password}
                  onChange={(ev) =>
                    setUser({ ...user, password: ev.target.value })
                  }
                />
                <TextField
                  variant="outlined"
                  id="Password Confirmation"
                  label="Password Confirmation"
                  type="password"
                  value={user.password_confirmation}
                  onChange={(ev) =>
                    setUser({ ...user, password_confirmation: ev.target.value })
                  }
                />
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => onSubmit(user)}
                >
                  Save
                </Button>
              </Stack>
            </DialogContent>
          </Dialog>
        )}

        <TableContainer sx={{ height: 380 }} fullWidth
            maxWidth="sm">
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
                        {/* <TableCell>{r.created_at}</TableCell> */}
                        <TableCell>{r.role_id}</TableCell>
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
          count={users.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
      {/* </Box> */}
      {/* </Stack> */}
    </>
  );
}
