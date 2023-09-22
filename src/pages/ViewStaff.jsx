import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function ViewStaff() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const { setNotification } = useStateContext();
    
    const [staff, setStaff] = useState([]);
    const [address, setAddress] = useState([]);
    const [zipcode, setZipcode] = useState([]);
    const [user, setUser] = useState([]);
 
    useEffect(() => {
    
            setLoading(true);
            axiosClient.get(`/staffs/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setStaff(data);
                    setAddress(data.address);
                    setZipcode(data.address.zipcode);
                    setUser(data.user)
                })
                .catch(() => {
                    setLoading(false);
                });
        
    }, []);

    return (
        <div>
            <div className="card animate fadeInDown">
            <h1 className="title">Staff Information</h1>
                {loading && <div className="text-center">Loading...</div>}
                {errors && 
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                }
                <p>Name: {staff.firstname} {staff.lastname} </p>
                <p>Address:{address.zone}, {address.barangay}, {zipcode.area}, {zipcode.province},  {zipcode.zipcode} </p>
                <p>Contact Number: {staff.contact_num}</p>

                <h2>User Account</h2>
                <p>Email: {user.email} </p>
                <p>Username: {user.username} </p>

                <Link to={`/staffs/${staff.id}/pets`} className="btn-edit" > Pets </Link>
                <Link to={`/staffs/`+staff.id+'/update'} className="btn-edit" > Update Staff </Link>
                <Link to={`/users/${user.id}`} className="btn-edit">Update User Account</Link>
                <Link className="btn" to="/staffs">Back</Link>
                
            </div>
        </div>
    );
}
