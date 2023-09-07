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

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
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
        element: <StaffForm key="petownerCreate" />,
      },
      {
        path: "/staffs/:id",
        element: <StaffForm key="petownerUpdate" />,
      },

      {
        path: "/petowners",
        element: <PetOwners />,
      },

      {
        path: "/petowners/new",
        element: <PetOwnerForm key="petownerCreate" />,
      },
      {
        path: "/petowners/:id",
        element: <PetOwnerForm key="petownerUpdate" />,
      },
      {
        path: "/petowners/:id/pets",
        element: <Pets key="viewPets" />,
      },

      {
        path: "/pets/new",
        element: <PetForm />,
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
