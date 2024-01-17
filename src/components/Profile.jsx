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
import Swal from "sweetalert2";

export default function Profile() {
  const { user, setToken, updateUser, staffuser } = useStateContext();
  const navigate = useNavigate();

  //for modal
  const [errors, setErrors] = useState(null);
  const [loading, setloading] = useState(false);

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
  const anchorRef = useRef(null);

  const logoutmodal = () => {
    Swal.fire({
      icon: "question",
      title: "Do you want to logout?",
      showDenyButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.post("/logout").then(() => {
          setToken(null);
          updateUser({});
          navigate("/login");
        });
      }
    });
  };

  const closepopup = () => {
    setopenchange(false);
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
        .patch(`/users/${userprofile.id}`, userprofile)
        .then((response) => {
          setopenchange(false);
          updateUser(response.data);
          window.location.reload(false);
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
          {staffuser && (
            <Typography variant="span" color="white">
              {staffuser.firstname && staffuser.lastname !== "null"
                ? `${staffuser.firstname} ${staffuser.lastname}`
                : "ADMIN"}
            </Typography>
          )}
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
                    {user.role_id === "1" && [
                      <MenuItem key="edit" onClick={onEdit}>
                        Edit Account
                      </MenuItem>,
                      <MenuItem
                        key="settings"
                        onClick={() => navigate("/admin/settings")}
                      >
                        Settings
                      </MenuItem>,
                    ]}
                    {user.role_id === "2" && [
                      <MenuItem
                        key="profile"
                        onClick={() => navigate("/admin/myprofile")}
                      >
                        Profile
                      </MenuItem>,
                    ]}
                    {user.role_id === "3" && [
                      <MenuItem
                        key="petProfile"
                        onClick={() => navigate("/petowner/myprofile")}
                      >
                        Profile
                      </MenuItem>,
                    ]}
                    <MenuItem onClick={logoutmodal} key="logout">
                      Logout
                    </MenuItem>
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
    </Stack>
  );
}
