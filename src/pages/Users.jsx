import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
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
import { Add, Archive, Close, Delete, Edit } from "@mui/icons-material";
import UserEdit from "../components/modals/UserEdit";

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
  const [openAdd, setOpenAdd] = useState(false);

  const addModal = (ev) => {
    setOpenAdd(true);
    setUser({})
    setErrors(null);
  };

  const closepopup = () => {
    openchange(false);
    setOpenAdd(false)
  };

  const onEdit = (r) => {
    setErrors(null)
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
  

  const onSubmit = () => {
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
          setOpenAdd(false);
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
          <Button 
          // onClick={() => addModal()} 
          onClick={addModal}
           variant="contained" size="small">
            <Add />
          </Button>
        </Box>

        {notification && <Alert severity="success">{notification}</Alert>}

        <Backdrop open={modalloading} style={{ zIndex: 999 }}>
          <CircularProgress color="inherit" />
        </Backdrop>


        {/* {!modalloading && ( */}
          <UserEdit
          open={openAdd}
          onClick={closepopup}
          onClose={closepopup}
          id={null}
          onSubmit={onSubmit}
          loading={modalloading}
          roles={roles}
          user={user}
          setUser={setUser}
          errors={errors}
          isUpdate={null}
          />
        {/* )} */}

        {/* {!modalloading && ( */}
          <UserEdit
          open={open}
          onClick={closepopup}
          onClose={closepopup}
          id={user.id}
          onSubmit={onSubmit}
          loading={modalloading}
          roles={roles}
          user={user}
          setUser={setUser}
          errors={errors}
          isUpdate={user.id !== null}
          // onSubmit={() => onSubmit()}
          />
          {/* )} */}
          
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
                              // onClick={onEdit}
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
