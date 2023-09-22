import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function Staffs() {
    const { id } = useParams();
    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();

    const getstaffs = () => {

        // document.title = "Pet Owners";
        
        setLoading(true);
        axiosClient.get('/staffs')
            .then(({ data }) => {
                setLoading(false);
                setStaffs(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const onDelete = (po) => {
        if (!window.confirm("Are you sure?")) {
            return;
        }

        axiosClient.delete(`/staffs/${po.id}`).then(() => {
            setNotification("Pet Owner deleted");
            getstaffs();
        });
    };

    useEffect(() => {
        if (id) {
            setLoading(true);
            axiosClient.get(`/staffs/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setStaffs(data);
                })
                .catch(() => {
                    setLoading(false);
                });
    }

        }, [id]);

    useEffect(() => {
        getstaffs();
    }, []);
    console.log(staffs)

    return (
        <div>
            <div className="default-form animated fadeInDown">
                <div className="form" style={{textAlign:"center"}}>
                    <h1 className="title">STAFFS</h1>
                    <Link to="/users/new" className="btn">
                        Add new
                    </Link>

                    <div className="card animated fadeInDown">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Contact Number</th>
                                    <th>Address</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            {loading && (
                                <tbody>
                                    <tr>
                                        <td colSpan={5}>Loading...</td>
                                    </tr>
                                </tbody>
                            )}
                            {!loading && (
                                <tbody>
                                    {staffs.map(s => (
                                        <tr key={s.id}>
                                            <td>{s.id}</td>
                                            <td>{`${s.firstname} ${s.lastname}`}</td>
                                            <td>{s.contact_num}</td>
                                            <td>{s.address.barangay}, {s.address.zipcode.city} </td>
                                            <td>
                                                <Link to={`/staffs/`+s.id} className="btn-edit" > Edit </Link>
                                                <button onClick={() => onDelete(s)} className="btn-delete" > Delete </button>
                                            
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
