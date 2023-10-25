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
import Users from "./pages/Users";
import UserForm from "./pages/UserForm";
import ViewStaff from "./pages/ViewStaff";
import ViewPetOwner from "./pages/ViewPetOwner";
import Appointments from "./pages/Appointments";

import PetOwnerPets from "./pages/PetOwnerPets";
import MainLayout from "./components/MainLayout";
import Roles from "./pages/Roles";
import ClientService from "./pages/ClientService";
import AppointmentsPending from "./pages/AppointmentsPending";
import AppointmentsDone from "./pages/AppointmentsDone";
import PetOwnerAppointments from "./pages/PetOwnerAppointments";
import AppointmentsScheduled from "./pages/AppointmentsConfirmed";
import PetOwnerArchives from "./pages/PetOwnersArchives";
import Breeds from "./pages/Breeds";
import Species from "./pages/Species";
import StaffsArchives from "./pages/StaffsArchives";
import PetsArchives from "./pages/PetsArchives";
import AppointmentsConfirmed from "./pages/AppointmentsConfirmed";
import Receipt from "./pages/Receipt";
import ViewPet from "./pages/ViewPet";

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

          <Route path="admin/roles" element={<Roles />} />
          {/* <Route path="admin/roles/new" element={<RoleForm />} /> */}
          {/* <Route path="admin/roles/:id" element={<RoleForm />} /> */}

          <Route path="admin/users" element={<Users />} />
          <Route path="admin/users/archives" element={<Archives />} />
          {/* <Route path="admin/users/new" element={<UserForm />} /> */}
          {/* <Route path="admin/users/:id" element={<UserForm />} /> */}

          <Route path="admin/staffs" element={<Staffs />} />
          <Route path="admin/staffs/new" element={<StaffForm />} />
          <Route path="admin/staffs/:id" element={<StaffForm />} />
          <Route path="admin/staffs/:id/view" element={<ViewStaff />} />
          <Route path="admin/staffs/archives" element={<StaffsArchives />} />

          <Route path="admin/petowners" element={<PetOwners />} />
          <Route path="admin/petowners/new" element={<PetOwnerForm />} />
          <Route path="admin/petowners/:id/appointments" element={<PetOwnerAppointments />} />
          {/* <Route path="admin/petowners/:id/update" element={<PetOwnerForm />} /> */}
          <Route path="admin/petowners/:id/view" element={<ViewPetOwner />} />
          <Route path="admin/petowners/archives" element={<PetOwnerArchives />} />

          <Route path="admin/pets/:id/view" element={<ViewPet />} />

          <Route path="admin/pets/archives" element={<PetsArchives />} />

          <Route path="admin/pets/species" element={<Species />} />
          <Route path="admin/pets/breeds" element={<Breeds />} />
          

          {/* <Route path="admin/petowners/:id/pets" element={<Pets />} /> */}

          <Route path="admin/appointments" element={<Appointments />} />
          <Route path="admin/appointments/confirmed" element={<AppointmentsConfirmed />} />
          <Route path="admin/appointments/pending" element={<AppointmentsPending />} />
          <Route path="admin/appointments/completed" element={<AppointmentsDone />} />
          <Route path="admin/:id/chargeslip" element={<Receipt />} />



          <Route path="admin/clientservice" element={<ClientService />} />
          
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
