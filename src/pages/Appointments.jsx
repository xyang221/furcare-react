import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function Appointments() {
    const { id } = useParams();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    const { setNotification } = useStateContext();

    const getAppointments = () => {

        document.title = "Appointments";
        
        setLoading(true);
        axiosClient.get('/appointments')
            .then(({ data }) => {
                setLoading(false);
                setAppointments(data.data);
            })
            .catch(() => {
                setLoading(false);
            });

    };

    const onDelete = (a) => {
        if (!window.confirm("Are you sure?")) {
            return;
        }

        axiosClient.delete(`/appointments/${a.id}`).then(() => {
            setNotification("Appointment deleted");
            getAppointments();
        });
    };

    useEffect(() => {
        getAppointments();
    }, []);

    // console.log(appointments)

    return (
        <div>
            <div className="default-form animated fadeInDown">
                <div className="form" style={{textAlign:"center"}} >
                    <h1 className="title">APPOINTMENTS</h1>
                    <Link to="/appointments/new" className="btn">
                        Create Appointment
                    </Link>

                    <div className="card animated fadeInDown">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Client</th>
                                    <th>Purpose</th>
                                    <th>Status</th>
                                    {/* <th>Remarks</th> */}
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
                                    {appointments.map(a => (
                                        <tr key={a.id}>
                                            <td>{a.date}</td>
                                            <td>{`${a.petowner.firstname} ${a.petowner.lastname}`}</td>
                                            <td>{a.purpose}</td>
                                            <td>{a.status}</td>
                                            <td>{a.remarks}</td>
                                            <td>
                                                <Link to={`/appointments/`+a.id} className="btn-edit" > Edit </Link>
                                                <button onClick={() => onDelete(a)} className="btn-delete" > Delete </button>
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
