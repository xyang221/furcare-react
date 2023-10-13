import { Navigate, createBrowserRouter } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Users from "./pages/Users";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Dashboard from "./pages/Dashboard";
import UserForm from "./pages/UserForm";
import PetOwners from "./pages/PetOwners";
import PetOwnerForm from "./pages/PetOwnerForm";
import Pets from "./pages/Pets";
import PetForm from "./pages/PetForm";
import Staffs from "./pages/Staffs";
import StaffForm from "./pages/StaffForm";
import ViewStaff from "./pages/ViewStaff";
import AppointmentForm from "./pages/AppointmentForm";
import Appointments from "./pages/Appointments";
import ClientServiceForm from "./pages/ClientServiceForm";
import ViewPetOwner from "./pages/ViewPetOwner";
import Roles from "./pages/Roles";
import RoleForm from "./pages/RoleForm";
import Archives from "./pages/Archives";

import ProtectedStaffRoute from "./contexts/ProtectedStaffRoute";
import PetOwnerLayout from "./components/PetOwner/PetOwnerLayout";
import ProtectedPetOwnerRoute from "./contexts/ProtectedPetOwnerRoute";
// import PetOwnerPets from "./pages/PetOwner.jsx/PetOwnerPets";
import MainLayout from "./components/MainLayout";



const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedStaffRoute> <MainLayout /></ProtectedStaffRoute>,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" />,
      },

      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/archives",
        element: <Archives />,
      },

      {
        path: "/main",
        element: <MainLayout />,
      },

      {
        path: "/roles",
        element: <Roles />,
      },

      {
        path: "/roles/new",
        element: <RoleForm key="petownerCreate" />,
      },

      {
        path: "/roles/:id",
        element: <RoleForm key="petownerUpdate" />,
      },

      {
        path: "/users",
        element: <Users />,
      },

      {
        path: "/users/new",
        element: <UserForm key="userCreate" />,
      },
      {
        path: "/users/:id",
        element: <UserForm key="userUpdate" />,
      },

      {
        path: "/staffs",
        element: <Staffs />,
      },

      {
        path: "/staffs/new",
        element: <StaffForm key="staffCreate" />,
      },
      {
        path: "/staffs/:id",
        element: <ViewStaff/>,
      },

      {
        path: "/petowners",
        element: <PetOwners />,
      },

      {
        path: "/petowners/new",
        element: <PetOwnerForm />,
      },

      {
        path: "/petowners/:id",
        element: <ViewPetOwner />,
      },
      {
        path: "/petowners/:id/update",
        element: <PetOwnerForm key="petownerUpdate" />,
      },
      {
        path: "/petowners/:id/pets",
        element: <Pets key="viewPets" />,
      },

      {
        path: "/pets/:id",
        element: <PetForm key="updatePets" />,
      },

      {
        path: "/pets/new",
        element: <PetForm />,
      },

       {
        path: "/appointments",
        element: <Appointments />,
      },

      {
        path: "/appointments/new",
        element: <AppointmentForm key="petownerCreate" />,
      },
      {
        path: "/appointments/:id",
        element: <AppointmentForm key="petownerUpdate" />,
      },
      {
        path: "/clientservice/new",
        element: <ClientServiceForm />,
      },

    ],
  },
  {
    path: "/",
    element: <ProtectedPetOwnerRoute> <PetOwnerLayout /></ProtectedPetOwnerRoute>,
    children: [
      {
        path: "/",
        element: <Navigate to="/pets" />,
      },
      {
        path: "/asd",
        element: <Archives />,
      },
      // {
      //   path: "/pets",
      //   element: <PetOwnerPets />,
      // },
      {
        path: "/appointments",
        element: <Appointments />,
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
