import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function UserForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const {setNotification} = useStateContext();
    const [user, setUser] = useState({
        id: null,
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: null
    });

    const [roles,setRoles] = useState([]);

    const getRoles = () => {

        document.title = "Pet Owners";
        
        setLoading(true);
        axiosClient.get('/roles')
            .then(({ data }) => {
                setLoading(false);
                setRoles(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (id) {
            setLoading(true);
            axiosClient.get(`/users/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setUser(data);
                })
                .catch(() => {
                    setLoading(false);
                });
            }
        getRoles();
        }, [id]);

    const onSubmit = (ev) => {
        ev.preventDefault();
        if (user.id) {
            axiosClient.put(`/users/${user.id}`, user)
                .then(() => {
                    setNotification('User successfully updated')
                    navigate(`/users`);
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status == 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient.post(`/users`, user)
                .then(() => {
                    setNotification('User successfully created')
                    navigate(`/users`);
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
            {user.id && <h1  className="title">Update User</h1>}
            {!user.id && <h1 className="title">New User</h1>}

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
                     <h2>Create An Account</h2>
                     <div>  
                        <label htmlFor="address">Role:  </label>
                        <select
                            value={user.role_id}
                            onChange={(ev) =>
                                setUser({ ...user, role_id: ev.target.value })
                            }
                            >
                            <option value=""></option>
                            {roles.map(item => (
                                <option key={item.id} value={item.id}>
                                {item.role}
                                </option>
                            ))}
                            </select>
                        </div>

                        <div>
                        <label htmlFor="">Username: </label>
                        <input
                            value={user.username}
                            onChange={(ev) =>
                                setUser({ ...user, username: ev.target.value })
                            }
                            placeholder="Username"
                        />
                        </div>
                        
                        <div>
                        <label htmlFor="">Email: </label>
                        <input
                            type="email"
                            value={user.email}
                            onChange={(ev) =>
                                setUser({ ...user, email: ev.target.value })
                            }
                            placeholder="Email"
                        />
                        </div>

                        <div>
                        <label htmlFor="">Password: </label>
                        <input
                            type="password"
                            onChange={(ev) =>
                                setUser({ ...user, password: ev.target.value })
                            }
                            placeholder="Password"
                        />
                        </div>

                        <div>
                        <label htmlFor="">Password Confirmation:  </label>
                        <input
                            type="password"
                            onChange={(ev) =>
                                setUser({
                                    ...user,
                                    password_confirmation: ev.target.value,
                                })
                            }
                            placeholder="Password Confirmation"
                        />
                        </div>

                        <button className="btn">Save</button>
                        <Link to="/users" className="btn"> Back </Link>
                        {/* <Link to={`/users/`+po.id} className="btn-edit" > View </Link> */}
                    </form>
                )}
            </div>
            </div>
            </div>
        </div>
    );
}
