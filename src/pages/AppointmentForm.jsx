import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function AppointmentForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const { setNotification } = useStateContext();
    
    const [appointment, setAppointment] = useState({
        id: null,
        date: '',
        purpose: '',
        status: '',
        remarks: '',
        petowner_id: null
    });

    const [petowners, setPetowners] = useState([]);

    const getPetowners = () => {

        // setLoading(true);
        axiosClient.get('/pet_owners')
            .then(({ data }) => {
                setLoading(false);
                setPetowners(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
    };
 
    useEffect(() => {
        if (id) {
            setLoading(true);
            axiosClient.get(`/pet_owners/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setAppointment(data);
                })
                .catch(() => {
                    setLoading(false);
                });

    }
getPetowners();
        }, [id]);
   
    const onSubmit = (ev) => {
        ev.preventDefault();
        if (appointment.id) {
            axiosClient.put(`/appointments/${appointment.id}`, appointment)
                .then(() => {
                    setNotification("appointment successfully updated");
                    navigate('/appointments');
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status == 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient.post(`/appointments`, appointment)
                .then(() => {
                    setNotification("Appointment successfully created");
                    navigate('/appointments');
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status == 422) {
                        setErrors(response.data.errors);
                    }
                });

           
        }
    };

    return (
        <div>
            <div className="default-form animated fadeInDown">
                <div className="form">
            {appointment.id && <h1 className="title">UPDATE APPOINTMENT</h1>}
            {!appointment.id && <h1 className="title">CREATE APPOINTMENT</h1>}

            <div className="card animated fadeInDown">
                {loading && <div className="text-center">Loading...</div>}
                {errors && 
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                }

                {!loading && (
                    <form onSubmit={onSubmit} style={{textAlign:"center"}}>

                         <div>
                        <label htmlFor="">Date:</label>
                        <input type="date"
                            value={appointment.date}
                            onChange={(ev) =>
                                setAppointment({ ...appointment, date: ev.target.value })
                            }
                            placeholder="Date"
                        />
                        </div>
                       
                        <div>
                        <label htmlFor="">Purpose:</label>
                        <input type="text"
                            value={appointment.purpose}
                            onChange={(ev) =>
                                setAppointment({ ...appointment, purpose: ev.target.value })
                            }
                            placeholder="Purpose"
                        />
                        </div>

                        <div>
                        <label htmlFor="">Status:</label>
                        <input type="text"
                            value={appointment.status}
                            onChange={(ev) =>
                                setAppointment({ ...appointment, status: 'scheduled' })
                            }
                            placeholder="Status"
                        />
                        </div>

                        <div>
                        <label htmlFor="">Remarks:</label>
                        <input type="text"
                            value={appointment.remarks}
                            onChange={(ev) =>
                                setAppointment({ ...appointment, remarks: ev.target.value })
                            }
                            placeholder="Remarks"
                        />
                        </div>

                        <div>
                        <label htmlFor="">Pet Owner:</label>
                      <select
                            value={appointment.petowner_id}
                            onChange={(ev) =>
                                setAppointment({ ...appointment, petowner_id: ev.target.value })
                            }
                            >
                            <option value="">Pet Owner</option>
                            {petowners.map(po => (
                                <option key={po.id} value={po.id}>
                                {`${po.firstname} ${po.lastname}`}
                                </option>
                            ))}
                            </select>
                            </div>

                        <button className="btn">Save</button>
                        <Link className="btn" to="/appointments">Back</Link>
                    </form>
                )}
            </div>
            </div>
            </div>
        </div>
    );
}
