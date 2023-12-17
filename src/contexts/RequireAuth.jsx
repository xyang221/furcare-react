import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStateContext } from "./ContextProvider";

const RequireAuth = ({ allowedRoles }) => {
  const { token, user } = useStateContext();
  const location = useLocation();

  if (!token) {
    // Redirect to login if there's no token
    return <Navigate to="/login" />;
  } else if (!allowedRoles?.includes(user.role_id)) {
    // Redirect to home page if user's role doesn't match allowed roles
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If token and role are valid, render the child components
  return <Outlet />;
};

export default RequireAuth;
