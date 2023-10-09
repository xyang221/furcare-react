import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "./ContextProvider";

const  ProtectedStaffRoute = ({children}) => {
    const {token,role} = useStateContext();
    const [staff, setStaff] = useState(role==="1"?true:null);

    return  staff ? <>{children}</> : <Navigate to="/" />;

    // if (token && role === "1") {
    //     return <>{children} </>;
    // } else {
    //     return <Navigate to="/" />
    // }
}

  export default ProtectedStaffRoute