import React, { useState, useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import Main from "../components/MainLayout";
import StaffLayout from "../components/StaffLayout";
import PetOwnerLayout from "../components/PetOwner/PetOwnerLayout";
import NotFound from "./NotFound";
import { Navigate, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, token, setUser, setToken } = useStateContext();

  if (token) {
      return <Navigate to="/" />;
  }

  return (
    <>
    dashboard main
    </>
  )
}
