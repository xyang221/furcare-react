import styled from "@emotion/styled";
import { Mail, Notifications, Pets } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import Profile from "./Profile";

export default function Navbar() {

    // const { user, setUser, token, setToken } = useStateContext();

    // if (!token) {
    //     return <Navigate to="/login" />;
    // }

    // const onLogout = (ev) => {
    //     ev.preventDefault();

    //     axiosClient.post('/logout')
    //         .then(() => {
    //         setUser({});
    //         setToken(null);
    //     });
    // };

    // const getUser = () => {
    //     axiosClient.get('/user')
    //     .then(({ data }) => {
    //     setUser(data);
    // });
    // }

    // useEffect(() => {
    //    getUser()
    // }, []);

  const [open, setOpen] = useState(false);
  const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#b71c1c",
  });

  const Icons = styled(Box)(({ theme }) => ({
    display: "flex",
    gap: "20px",
    alignItems: "center",
  }));

  const UserBox = styled(Box)(({ theme }) => ({
    display: "flex",
    gap: "10px",
    alignItems: "center",
  }));

  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <Typography variant="h6">
          FurCare Clinic 
        </Typography>
        <Icons>
          <Badge badgeContent={4} color="primary">
            <Mail />
          </Badge>
          <Badge badgeContent={7} color="primary">
            <Notifications />
          </Badge>
          {/* <UserBox  onClick={e=>setOpen(true)}>
          <Avatar sx={{ width: 30, height: 30 }} />
          <Typography variant="span">{user.username} </Typography>
          </UserBox> */}
          <Profile/>
        </Icons>
      </StyledToolbar>
      {/* <Menu
        id="menu"
        aria-labelledby="menu"
        open={open}
        onClose={e=>setOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem>Edit Profile</MenuItem>
        <MenuItem onClick={onLogout} >Logout</MenuItem>
      </Menu> */}
    </AppBar>
  );
}
