import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "./ContextProvider";

const  ProtectedPetOwnerRoute = ({children}) => {
    const {token,role} = useStateContext();
    const [petowner, setPetOwner] = useState(role==="3"?true:null);

    return  petowner ? <>{children} </> : <Navigate to="/notfound" />;

    // if (token && role === "1") {
    //     return <>{children} </>;
    // } else {
    //     return <Navigate to="/" />
    // }
}

  export default ProtectedPetOwnerRoute