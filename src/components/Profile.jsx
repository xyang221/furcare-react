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
  Avatar,
  Typography,
} from "@mui/material";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import UserEdit from "./modals/UserEdit";

export default function Profile() {
  const { user, setToken } = useStateContext();
  const navigate = useNavigate();
  const userval = parseInt(user)

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setToken(null);
      navigate("/login");
    });
  };

  //for modal
  const [errors, setErrors] = useState(null);
  const [loading, setloading] = useState(false);
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

  const closepopup = () => {
    setopenchange(false);
  };

  const getUser = () => {
setloading(true)
    axiosClient
      .get(`/users/${user.id}`)
      .then(({ data }) => {
        setUserprofile(data);
        setloading(false)
      })
      .catch(() => {
        setNotification("There is something wrong in the users api");
        setloading(false)
      });
  }

  const onEdit = () => {
    getRoles();
    setErrors(null)
    setopenchange(true);
    getUser();
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
           {user.username}
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
      <UserEdit
          open={openchange}
          onClick={closepopup}
          onClose={closepopup}
          // id={userdata.id}
          onSubmit={onSubmit}
          loading={loading}
          roles={roles}
          user={userprofile}
          setUser={setUserprofile}
          errors={errors}
          isUpdate={userprofile.id}
        />

    </Stack>
  );
}
