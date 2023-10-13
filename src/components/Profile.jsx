import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import {
  Alert,
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import { Close } from "@mui/icons-material";

export default function Profile() {
  const { user, setUser, token, setToken, setRole } = useStateContext();
  const navigate = useNavigate();
  const userval = parseInt(user)

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser(null);
      setToken(null);
      setRole(null);
      navigate("/login");
    });
  };

  //for modal
  const [errors, setErrors] = useState(null);
  const [modalloading, setModalloading] = useState(false);
  const [notification, setNotification] = useState(false);

  const [userprofile, setUserprofile] = useState({
    id: null,
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: null,
  });
  
  const [openchange, setopenchange] = useState(false);

  const [roles, setRoles] = useState([]);

  // const getRoles = () => {
  //   setModalloading(true);
  //   axiosClient
  //     .get("/roles")
  //     .then(({ data }) => {
  //       setModalloading(false);
  //       setRoles(data.data);
  //     })
  //     .catch(() => {
  //       setModalloading(false);
  //     });
  // };

  const getRoles = () => {
    axiosClient
      .get("/roles")
      .then(({ data }) => {
        setRoles(data.data);
      })
      .catch(() => {
        setNotification("There is something wrong in the roles api");
      });
  };

  const functionopenpopup = (ev) => {
    setopenchange(true);
    setUserprofile({});
    setErrors(null);
  };

  const closepopup = () => {
    setopenchange(false);
  };

  // const getUser = () => {
  //   setModalloading(true);
  //   axiosClient
  //     .get(`/users/${userval}`)
  //     .then(({ data }) => {
  //       setModalloading(false);
  //       setUserprofile(data);
  //     })
  //     .catch(() => {
  //       setModalloading(false);
  //     });
  // }

  const getUser = () => {
    axiosClient
      .get(`/users/${userval}`)
      .then(({ data }) => {
        setUserprofile(data);
      })
      .catch(() => {
        setNotification("There is something wrong in the users api");
      });
  }

  const onEdit = () => {
    setErrors(null)
    setopenchange(true);
  };
  
  const onSubmit = () => {
    if (userprofile.id) {
      axiosClient
        .put(`/users/${userprofile.id}`, userprofile)
        .then(() => {
          // setNotification("User was successfully updated");
          setopenchange(false);
          // getUsers();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/users`, userprofile)
        .then(() => {
          // setNotification("User was successfully created");
          setopenchange(false);
          // getUsers();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  //for menuitem
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    getUser();
    getRoles();
  }, []);

  return (
    <Stack direction="row" spacing={2}>
      <div>
        <Button
          ref={anchorRef}
          id="composition-button"
          aria-controls={open ? "composition-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <Avatar sx={{ width: 30, height: 30 }} />
          <Typography variant="span" color="white">
            {userprofile.username}
          </Typography>
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "top-start" ? "left bottom" : "left top",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem onClick={() => onEdit()}>
                      Edit Profile
                    </MenuItem>
                    <MenuItem onClick={onLogout}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
      {!modalloading && (
        <Dialog
          // fullScreen
          open={openchange}
          onClose={closepopup}
          fullWidth
          maxWidth="sm"
        >
          {userval && (
            <DialogTitle>
              Update User
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
            <Stack spacing={2} margin={2}>
              {userprofile.role_id && (
                <Select
                  label="Role"
                  value={userprofile.role_id || ""}
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

              <TextField
                variant="outlined"
                id="Username"
                label="Username"
                value={userprofile.username}
                onChange={(ev) =>
                  setUserprofile({ ...userprofile, username: ev.target.value })
                }
              />
              <TextField
                variant="outlined"
                id="Email"
                label="Email"
                type="email"
                value={userprofile.email}
                onChange={(ev) =>
                  setUserprofile({ ...userprofile, email: ev.target.value })
                }
              />
              <TextField
                variant="outlined"
                id="Password"
                label="Password"
                type="password"
                value={userprofile.password}
                onChange={(ev) =>
                  setUserprofile({ ...userprofile, password: ev.target.value })
                }
              />
              <TextField
                variant="outlined"
                id="Password Confirmation"
                label="Password Confirmation"
                type="password"
                value={userprofile.password_confirmation}
                onChange={(ev) =>
                  setUserprofile({
                    ...userprofile,
                    password_confirmation: ev.target.value,
                  })
                }
              />
              <Button
                color="primary"
                variant="contained"
                onClick={() => onSubmit()}
              >
                Save
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>
      )}
    </Stack>
  );
}
