import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import { Avatar, Typography } from "@mui/material";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import UserEdit from "./modals/UserEdit";
import LogoutModal from "./modals/LogoutModal";

export default function Profile() {
  const { user, setToken, updateUser, staff, petowner } = useStateContext();
  const navigate = useNavigate();

  //for modal
  const [errors, setErrors] = useState(null);
  const [loading, setloading] = useState(false);
  const [notification, setNotification] = useState(false);

  const [userprofile, setUserprofile] = useState({
    id: null,
    email: "",
    password: "",
    password_confirmation: "",
    role_id: null,
  });

  const [openchange, setopenchange] = useState(false);

  const [roles, setRoles] = useState([]);

  //for menuitem
  const [open, setOpen] = useState(false);
  const [openlogout, setOpenlogout] = useState(false);
  const anchorRef = useRef(null);

  const logoutmodal = () => {
    setOpenlogout(true);
  };

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setToken(null);
      updateUser({});
      navigate("/login");
    });
  };

  const closepopup = () => {
    setopenchange(false);
    setOpenlogout(false);
  };

  const getUser = () => {
    setloading(true);
    axiosClient
      .get(`/users/${user.id}`)
      .then(({ data }) => {
        setUserprofile(data);
        setloading(false);
      })
      .catch(() => {
        setNotification("There is something wrong in the users api");
        setloading(false);
      });
  };

  const onEdit = () => {
    setErrors(null);
    setopenchange(true);
    getUser();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (userprofile.id) {
      axiosClient
        .put(`/users/${userprofile.id}`, userprofile)
        .then((response) => {
          setNotification("User was successfully updated");
          setopenchange(false);
          updateUser(response.data);
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
          <Avatar sx={{ width: 30, height: 30, margin: "5px" }} />
          {staff && (
            <Typography variant="span" color="white">
              {staff.firstname && staff.lastname !== "null"
                ? `${staff.firstname} ${staff.lastname}`
                : "ADMIN"}
            </Typography>
          )}
          {/* {petowner && (
            <Typography variant="span" color="white">
              {petowner.firstname && petowner.lastname !== "null"
                ? `${petowner.firstname} ${petowner.lastname}`
                : "ADMIN"}
            </Typography>
          )} */}
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
                    <MenuItem onClick={() => onEdit()}>Edit Profile</MenuItem>
                    {user.role_id === "1"  && ( 
                        <MenuItem onClick={() => navigate("/admin/settings")}>
                          Settings
                        </MenuItem>
                      )}

                    <MenuItem onClick={logoutmodal}>Logout</MenuItem>
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
        onSubmit={onSubmit}
        loading={loading}
        roles={roles}
        user={userprofile}
        setUser={setUserprofile}
        errors={errors}
        isUpdate={userprofile.id}
      />
      <LogoutModal
        open={openlogout}
        onClick={closepopup}
        onClose={closepopup}
        onSubmit={onLogout}
        loading={loading}
        errors={errors}
      />
    </Stack>
  );
}
