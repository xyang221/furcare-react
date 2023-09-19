import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function Roles() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);

    const { setNotification } = useStateContext();

    const getRoles = () => {
        
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

    const onDelete = (r) => {
        if (!window.confirm("Are you sure?")) {
            return;
        }

        axiosClient.delete(`/roles/${r.id}`).then(() => {
            setNotification("Role deleted");
            getRoles();
        });
    };

    useEffect(() => {
        getRoles();
    }, []);

    return (
        <div>
            <div className="default-form animated fadeInDown">
                <div className="form" style={{textAlign:"center"}}>
                    <h1 className="title">Roles</h1>
                    <Link to="/roles/new" className="btn">
                        Add Role
                    </Link>

                    <div className="card animated fadeInDown">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Role</th>
                                    <th>Descrption</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            {loading && (
                                <tbody>
                                    <tr>
                                        <td colSpan={4}>Loading...</td>
                                    </tr>
                                </tbody>
                            )}
                            {!loading && (
                                <tbody>
                                    {roles.map(r => (
                                        <tr key={r.id}>
                                            <td>{r.id}</td>
                                            <td>{r.role}</td>
                                            <td>{r.description}</td>
                                            <td>
                                            <Link to={`/roles/`+r.id} className="btn-edit">
                                                    Edit
                                                </Link>
                                               
                                                <button
                                                    onClick={() => onDelete(r)}
                                                    className="btn-delete"
                                                > Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            )}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
