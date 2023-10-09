import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Archives from "./pages/Archives";
import Staffs from "./pages/Staffs";
import StaffForm from "./pages/StaffForm";
import PetOwners from "./pages/PetOwners";
import PetOwnerForm from "./pages/PetOwnerForm";
import NotFound from "./pages/NotFound";
import RequireAuth from "./contexts/RequireAuth";
import GuestLayout from "./components/GuestLayout";
import Dashboard from "./pages/Dashboard";
import RoleForm from "./pages/RoleForm";
import Users from "./pages/Users";
import UserForm from "./pages/UserForm";
import ViewStaff from "./pages/ViewStaff";
import ViewPetOwner from "./pages/ViewPetOwner";
import Pets from "./pages/Pets";
import PetForm from "./pages/PetForm";
import Appointments from "./pages/Appointments";
import AppointmentForm from "./pages/AppointmentForm";
import ClientServiceForm from "./pages/ClientServiceForm";
import StaffLayout from "./components/StaffLayout";
import PetOwnerLayout from "./components/PetOwner/PetOwnerLayout";

// petowner pages
import PetOwnerPets from "./pages/PetOwner.jsx/PetOwnerPets";
import MainLayout from "./components/MainLayout";
import { Switch } from "@mui/material";
import Roles from "./pages/Roles";

const roles = {
  ADMIN: "1",
  STAFF: "2",
  PETOWNER: "3",
};

function App() {
  return (
    <>
      <Routes>
        <Route
          element={
            <RequireAuth
              allowedRoles={[roles.ADMIN, roles.PETOWNER, roles.STAFF]}
            />
          }
        >
          <Route path="/" element={<MainLayout />} >
          <Route path="editprofile/:id" element={<UserForm />} />
          
        <Route element={<RequireAuth allowedRoles={[roles.ADMIN]} />}>
         

          <Route path="admin/archives" element={<Archives />} />

          <Route path="admin/roles" element={<Roles />} />
          {/* <Route path="admin/roles/new" element={<RoleForm />} /> */}
          {/* <Route path="admin/roles/:id" element={<RoleForm />} /> */}

          <Route path="admin/users" element={<Users />} />
          {/* <Route path="admin/users/new" element={<UserForm />} /> */}
          {/* <Route path="admin/users/:id" element={<UserForm />} /> */}

          <Route path="admin/staffs" element={<Staffs />} />
          <Route path="admin/staffs/new" element={<StaffForm />} />
          <Route path="admin/staffs/:id" element={<StaffForm />} />
          <Route path="admin/staffs/:id/update" element={<ViewStaff />} />

          <Route path="admin/petowners" element={<PetOwners />} />
          <Route path="admin/petowners/new" element={<PetOwnerForm />} />
          <Route path="admin/petowners/:id" element={<PetOwnerForm />} />
          <Route path="admin/petowners/:id/update" element={<ViewPetOwner />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[roles.STAFF]} />}>
          {/* <Route path="staff/dashboard" element={<StaffLayout />} /> */}
          <Route path="staffs/new" element={<StaffForm />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[roles.PETOWNER]} />}>
          {/* <Route path="dashboard" element={<PetOwnerLayout />} /> */}
          <Route path="pets" element={<PetOwnerPets />} />
          <Route path="appointments" element={<Appointments />} />
        </Route>
        </Route>
        </Route>

        <Route path="/" element={<GuestLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
