import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import Navbar from "./Navbar";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import Sidebar from "./Sidebar";
import StaffSidebar from "./StaffSidebar";
import PetOwnerSidebar from "./PetOwnerSidebar";
import Dashboard from "../pages/Dashboard";
import Modaltry from "./Modal";
import UploadImage from "./UploadImage";

export default function MainLayout() {
  const { user, token } = useStateContext();

  // Redirect to the login page if there's no token
  if (!token) {
    return <Navigate to="/login" />
  }

  let sidebarComponent = null;
  let dashboardComponent = null;

  switch (user.role_id) {
    case "1":
      sidebarComponent = <Sidebar />;
      dashboardComponent = <Dashboard/>
      break;
    case "2":
      sidebarComponent = <StaffSidebar />;
      break;
    case "3":
      sidebarComponent = <PetOwnerSidebar />;
      dashboardComponent= <>petowner dashboard</>
      break;
    default:
      sidebarComponent = null;
  }

  return (
    <>
      <CssBaseline />
      <Box>
        <Navbar />
        <Box display="flex" justifyContent="space-between">
          {sidebarComponent}
          <Box flex={5}>
            {/* <Box position="fixed"> */}
            {/* main layout sagol ang dashboard */}
            <Outlet />
            <UploadImage/>
            {/* </Box> */}
          </Box>
        </Box>
      </Box>
    </>
  );
}
