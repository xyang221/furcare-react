import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "./ContextProvider";

const RequireAuth = ({ allowedRoles }) => {
  const { token, user } = useStateContext();
  const location = useLocation();

  //   return token && allowedRoles?.includes(user.role_id) ? (
  //     <Outlet />
  //   ) : !allowedRoles?.includes(user.role_id) ? (
  //     <Navigate to="/" state={{ from: location }} replace />
  //   ) : (
  //     <Navigate to="/login" state={{ from: location }} replace />
  //   );
  return token && allowedRoles?.includes(user.role_id) ? (
    <Outlet />
  ) : !token ? (
    <Navigate to="/login"  />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default RequireAuth;
