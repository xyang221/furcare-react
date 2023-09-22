import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";

export default function DefaultLayout() {
    const { user, token, setUser, setToken } = useStateContext();

    if (!token) {
        return <Navigate to="/login" />;
    }

    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
      setDropdownOpen(!isDropdownOpen);
    };
    const onLogout = (ev) => {
        ev.preventDefault();

        axiosClient.post('/logout')
            .then(() => {
            setUser({});
            setToken(null);
        });
    };

    useEffect(() => {
        axiosClient.get('/user')
            .then(({ data }) => {
            setUser(data);
        });
    }, []);

    return (
        <div id="defaultLayout">
            <aside>
            <svg xmlns="http://www.w3.org/2000/svg" width="41" height="36" viewBox="0 0 41 36" fill="none" >
  <path fill-rule="evenodd" clip-rule="evenodd" d="M5.125 24.0852H35.875V27.0148H5.125V24.0852ZM5.125 16.7611H35.875V19.6907H5.125V16.7611ZM5.125 9.43701H35.875V12.3666H5.125V9.43701Z" fill="black"/>
</svg>
<img  className="icon" />


                <Link to="/dashboard">Dashboard</Link>
                <ul onClick={toggleDropdown}>
                  Registration
                  {isDropdownOpen ? <span>&#9650;</span> : <span>&#9660;</span>}
                </ul>
                  {isDropdownOpen && (
                    <ul>
                       <li>
                      <Link to="/users/new">Admin</Link>
                      </li>
                      <li>
                      <Link to="/staffs/new">Doctor/Staffs</Link>
                      </li>
                      <li>
                      <Link to="/petowneruser">Pet Owners</Link>
                      </li>
                    </ul>
                  )}
                <Link to="/roles">Roles</Link>
                <Link to="/users">Users</Link>
                {/* <Link to="/users">Archived Files</Link> */}
                <Link to="/petowners/new">Registration</Link>
                <Link to="/petowneruser">Petowner Form</Link>
                <ul onClick={toggleDropdown}>
                  Profile Data
                  {isDropdownOpen ? <span>&#9650;</span> : <span>&#9660;</span>}
                </ul>
                  {isDropdownOpen && (
                    <ul>
                      <li>
                      <Link to="/petowners">Pet Owners</Link>
                      </li>
                      <li>
                      <Link to="/staffs">Staffs</Link>
                      </li>
                      <li>
                      <Link to="/pets">Pet</Link>
                      </li>
                    </ul>
                  )}
                <Link to="/appointments">Appointments</Link>
                <Link to="/clientservice/new">Client Service Form</Link>

                
            <ul onClick={toggleDropdown}>
              Medical Certificate
              {isDropdownOpen ? <span>&#9650;</span> : <span>&#9660;</span>}
            </ul>
            {isDropdownOpen && (
              <ul>
                <li>
                <Link to="/dashboard">Vaccination</Link>
                </li>
                <li>
                <Link to="/staffs">Deworming</Link>
                </li>
              </ul>
            )}
            </aside>
            <div className="content">
                <header>
                    <div>FurCare Clinic Management System</div>
                    <div>
                        {user.username}
                        <Link to={`/users/`+user.id} className="btn-edit">Edit Profile</Link>
                        <a href="#" onClick={onLogout} className="btn-logout">
                            Logout
                        </a>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}