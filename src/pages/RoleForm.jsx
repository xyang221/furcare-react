import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function RoleForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const {setNotification} = useStateContext();
    const [role, setRole] = useState({
        id: null,
        role: '',
        description: '',
    });

    useEffect(() => {
        if (id) {
            setLoading(true);
            axiosClient.get(`/roles/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setRole(data);
                })
                .catch(() => {
                    setLoading(false);
                });
            }
        }, [id]);

    const onSubmit = (ev) => {
        ev.preventDefault();
        if (role.id) {
            axiosClient.put(`/roles/${role.id}`, role)
                .then(() => {
                    setNotification('role successfully updated')
                    navigate(`/roles`);
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status == 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient.post(`/roles`, role)
                .then(() => {
                    setNotification('role successfully created')
                    navigate(`/roles`);
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }
    };

    
    return (
        <div>
            <div className="default-form animated fadeInDown">
                <div className="form">
            {role.id && <h1  className="title">Update Role</h1>}
            {!role.id && <h1 className="title">New Role</h1>}

            <div className="card animated fadeInDown">
                {loading && <div className="text-center">Loading...</div>}
                {errors && 
                    <div className= "alert">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                }
                {!loading && (
                    <form onSubmit={onSubmit} style={{textAlign:"center"}}>
                        <div>
                        <label htmlFor="">Role: </label>
                        <input
                        // type="text"
                            value={role.role}
                            onChange={(ev) =>
                                setRole({ ...role, role: ev.target.value })
                            }
                            placeholder="Role"
                        />
                        </div>
                        
                        <div>
                        <label htmlFor="">Description: </label>
                        <input
                            type="text"
                            value={role.description}
                            onChange={(ev) =>
                                setRole({ ...role, description: ev.target.value })
                            }
                            placeholder="Description"
                        />
                        </div>

                        <button className="btn">Save</button>
                        <Link to="/roles" className="btn"> Back </Link>
                    </form>
                )}
            </div>
            </div>
            </div>
        </div>
    );
}
