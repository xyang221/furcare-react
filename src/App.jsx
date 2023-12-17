import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Staffs from "./pages/Staffs";
import StaffForm from "./pages/StaffForm";
import PetOwners from "./pages/PetOwners";
import PetOwnerForm from "./pages/PetOwnerForm";
import NotFound from "./pages/NotFound";
import RequireAuth from "./contexts/RequireAuth";
import GuestLayout from "./components/GuestLayout";
import Users from "./pages/Users";
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
import Pets from "./pages/Pets";
import PetDeworming from "./pages/PetDeworming";
import Services from "./pages/Services";
import Diagnosis from "./pages/Diagnosis";
import PetOwnerAvail from "./pages/PetOwnerAvail";
import PetownerAvailService from "./pages/PetOwnerAvailService";
import ClientServiceForm from "./pages/ClientServiceForm";
import TreatmentForm from "./pages/TreatmentForm";
import ServiceCatBtns from "./components/ServiceCatTabs";
import PrintComponent from "./pages/Billing/ChargeSlipPrint";
import Settings from "./pages/Settings";
import SettingsTabs from "./components/SettingsTabs";
import UserArchives from "./pages/UserArchives";
import Home from "./pages/Home";
import ViewPetOwnerPets from "./pages/ViewPetOwnerPets";

const roles = {
  ADMIN: "1",
  STAFF: "2",
  PETOWNER: "3",
};

function App() {
  return (
    <>
      <Routes>
        {/* Authenticated Routes */}
        <Route
          element={
            <RequireAuth
              allowedRoles={[roles.ADMIN, roles.PETOWNER, roles.STAFF]}
            />
          }
        >
          <Route path="/" element={<MainLayout />}>
            {/* Admin-Only Routes */}
            <Route
              path="admin/*"
              element={<RequireAuth allowedRoles={[roles.ADMIN]} />}
            >
              <Route path="home" element={<Home />} />
              <Route path="settings" element={<SettingsTabs />} />

              <Route path="roles" element={<Roles />} />

              <Route path="users" element={<Users />} />
              <Route path="users/archives" element={<UserArchives />} />

              <Route path="staffs" element={<Staffs />} />
              <Route path="staffs/new" element={<StaffForm />} />
              <Route path="staffs/:id" element={<StaffForm />} />
              <Route path="staffs/:id/view" element={<ViewStaff />} />
              <Route path="staffs/archives" element={<StaffsArchives />} />

              <Route path="petowners" element={<PetOwners />} />
              <Route path="petowners/new" element={<PetOwnerForm />} />
              <Route
                path="petowners/:id/appointments"
                element={<PetOwnerAppointments />}
              />
              <Route path="petowners/:id/view" element={<ViewPetOwner />} />
              <Route path="petowners/archives" element={<PetOwnerArchives />} />

              <Route path="pets/:id/view" element={<ViewPet />} />
              <Route path="pets" element={<Pets />} />
              <Route path="pets/archives" element={<PetsArchives />} />
              <Route path="pets/species" element={<Species />} />
              <Route path="pets/breeds" element={<Breeds />} />

              <Route path="appointments" element={<Appointments />} />
              <Route
                path="appointments/confirmed"
                element={<AppointmentsConfirmed />}
              />
              <Route
                path="appointments/pending"
                element={<AppointmentsPending />}
              />
              <Route
                path="appointments/completed"
                element={<AppointmentsDone />}
              />

              <Route path=":id/chargeslip" element={<PrintComponent />} />

              <Route path="services/petowners" element={<PetOwnerAvail />} />
              <Route
                path="services/petowners/:id/avail"
                element={<ServiceCatBtns />}
              />
              {/* <Route path="services" element={<Services />} /> */}
              <Route path="services/consultation" element={<Diagnosis />} />
              <Route
                path="services/petowner/:id/avail/admission"
                element={<ClientServiceForm />}
              />
              <Route
                path="services/petowner/:id/avail/admission/treatment"
                element={<TreatmentForm />}
              />

              <Route path="clientservice" element={<ClientService />} />
            </Route>

            {/* Staff-Only Routes */}
            <Route
              path="staffs/*"
              element={<RequireAuth allowedRoles={roles.STAFF} />}
            >
              <Route path="register" element={<StaffForm />} />
            </Route>

            {/* Pet Owner-Only Routes */}
            <Route
              path="petowners/*"
              element={<RequireAuth allowedRoles={[roles.PETOWNER]} />}
            >
              <Route path="pets" element={<ViewPetOwnerPets />} />
              <Route path="appointments" element={<PetOwnerAppointments />} />
            </Route>
          </Route>
        </Route>

        {/* Guest Routes */}
        <Route path="/" element={<GuestLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
