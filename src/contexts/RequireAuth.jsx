import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useStateContext } from "./ContextProvider"

const RequireAuth = ({allowedRoles}) => {
    const {token,user,role} = useStateContext()
    const location = useLocation();

    return (
        token && allowedRoles?.includes(role)
        ? <Outlet/> 
        : token && !allowedRoles?.includes(role) ?
        <Navigate to="/" state={{from: location}} replace />
: 
         <Navigate to="/login" state={{from: location}} replace />
        //  :  <Navigate to="/login" state={{from: location}} replace />
    )
}

export default RequireAuth;