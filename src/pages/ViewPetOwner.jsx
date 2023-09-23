import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function ViewPetOwner() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const { setNotification } = useStateContext();
    
    const [petowner, setPetowner] = useState([]);
    const [address, setAddress] = useState([]);
    const [zipcode, setZipcode] = useState([]);
    const [user, setUser] = useState([]);
 
    useEffect(() => {
    
            setLoading(true);
            axiosClient.get(`/petowners/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setPetowner(data);
                    setAddress(data.address);
                    setZipcode(data.address.zipcode);
                    setUser(data.user)
                })
                .catch(() => {
                    setLoading(false);
                });
        
    }, []);

    console.log(petowner);

    return (
        <div>
            <div className="card animate fadeInDown">
            <h1 className="title">Pet Owner Details</h1>
                {loading && <div className="text-center">Loading...</div>}
                {errors && 
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                }
                <p>Name: {petowner.firstname} {petowner.lastname} </p>
                <p>Address: {address.zone}, {address.barangay}, {zipcode.area}, {zipcode.province},  {zipcode.zipcode} </p>
                <p>Contact Number: {petowner.contact_num}</p>

                <h2>Mobile Account</h2>
                <p>Email: {user.email} </p>
                <p>Username: {user.username} </p>

                <Link to={`/petowners/${petowner.id}/pets`} className="btn-edit" > Pets </Link>
                <Link to={`/petowners/`+petowner.id+'/update'} className="btn-edit" > Update Pet Owner </Link>
                <Link to={`/users/${user.id}`} className="btn-edit">Update User Account</Link>
                <Link className="btn" to="/petowners">Back</Link>
                
            </div>
        </div>
    );
}
