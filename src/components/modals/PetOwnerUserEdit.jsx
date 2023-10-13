import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { Link, useParams } from "react-router-dom";
import {
  Alert,
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Add, Archive, Close, Delete, Edit } from "@mui/icons-material";

export default function PetOwnerUserEdit(props) {
  const { open, onClose, onClick,id } = props;

  // const { id } = useParams();
  const [errors, setErrors] = useState(null);
  const [notification, setNotification] = useState("");
  const [user, setUser] = useState({
        id: null,
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: null
    });

  const [loading, setLoading] = useState(false);

  const getUsers = () => {
    if (id) {
      setLoading(true);
      axiosClient
        .get(`/users/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setUser(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  const [roles,setRole] = useState([]);
  
  const getRoles = () => {
      setLoading(true);
      axiosClient
        .get(`/roles`)
        .then(({ data }) => {
          setLoading(false);
          setRole(data.data);
        })
        .catch(() => {
          setLoading(false);
        });
  };

  const onSubmit = () => {
    axiosClient
      .put(`/users/${id}`, user)
      .then(() => {
        setNotification("Petowner successfully updated");
      })
      .catch((err) => {
        setErrors(err);
      });
  };

  useEffect(() => {
    getUsers()
    getRoles()
  }, [id]);

  return (
    <>
    <Dialog
    // fullScreen
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth="sm"
  >
    {user.id && (
      <DialogTitle>
        Update User
        <IconButton onClick={onClick} style={{ float: "right" }}>
          <Close color="primary"></Close>
        </IconButton>{" "}
      </DialogTitle>
    )}

    {!user.id && (
      <DialogTitle>
        New User
        <IconButton onClick={onClick} style={{ float: "right" }}>
          <Close color="primary"></Close>
        </IconButton>{" "}
      </DialogTitle>
    )}

    <Backdrop open={loading} style={{ zIndex: 999 }}>
    <CircularProgress color="inherit" />
  </Backdrop>


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


      {!loading && (<Stack spacing={2} margin={2}>
          <Select
            label="Role"
            value={user.role_id || ""}
            onChange={(ev) =>
              setUser({ ...user, role_id: ev.target.value })
            }
            disabled
          >
            {roles.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.role}
              </MenuItem>
            ))}
          </Select>

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
          onClick={() => onSubmit()}
        >
          Save
        </Button>
      </Stack>)}
    </DialogContent>
  </Dialog>
  </>
  );
}
