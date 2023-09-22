import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function StaffForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const { setNotification } = useStateContext();
    
    const [staff, setStaff] = useState({
        id: null,
        // user_id: null,
        firstname: '',
        lastname: '',
        contact_num: '',
        address_id: null,
    });

    const [address,setAddress]= useState([]);
 
    useEffect(() => {
        if (id) {
            setLoading(true);
            axiosClient.get(`/staffs/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setStaff(data);
                })
                .catch(() => {
                    setLoading(false);
                });

    }

        }, [id]);
   
    const onSubmit = (ev) => {
        ev.preventDefault();
        if (staff.id) {
            axiosClient.put(`/staff/${staff.id}`, staff)
                .then(() => {
                    setNotification("staff successfully updated");
                    navigate('/staffs');
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status == 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient.post(`user/${id}/staff`, staff)
                .then(() => {
                    setNotification("Pet Owner successfully created");
                    navigate('/staffs');
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status == 422) {
                        setErrors(response.data.errors);
                    }
                });

           
        }
    };

    useEffect(() => {
      
        axiosClient.get(`/addresses`)
        .then(({ data }) => {
            setLoading(false);
            setAddress(data.data);
        })
        .catch(() => {
            setLoading(false);
        });


        }, []);
    // debugger;
    return (
        <div>
             <div className="default-form animated fadeInDown">
                <div className="form">
            {staff.id && <h1 className="title">UPDATE STAFF</h1>}
            {!staff.id && <h1 className="title">REGISTER STAFF</h1>}

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
                    <form onSubmit={onSubmit}>
                        <h2>Staff Information</h2>

                            <div>
                        <label htmlFor="">First Name:</label>
                        <input type="text"
                            value={staff.firstname}
                            onChange={(ev) =>
                                setStaff({ ...staff, firstname: ev.target.value })
                            }
                            placeholder="First Name"
                        />
                        </div>

                        <div>
                        <label htmlFor="">Last Name:</label>
                        <input type="text"
                            value={staff.lastname}
                            onChange={(ev) =>
                                setStaff({ ...staff, lastname: ev.target.value })
                            }
                            placeholder="Last Name"
                        />
                        </div>

                        <div>
                        <label htmlFor="">Contact Number:</label>
                        <input
                            type="number"
                            value={staff.contact_num}
                            onChange={(ev) =>
                                setStaff({ ...staff,
                                    contact_num: ev.target.value,
                                })
                            }
                            placeholder="Contact Number"
                        />
                        </div>

                        <div>
                        <label htmlFor="address">Address: </label>
                        <select
                            // value={staff.address_id}
                            // onChange={(ev) =>
                            //     setStaff({ ...staff, address_id: ev.target.value })
                            // }
                            >
                            <option value="">Zipcode</option>
                            {address.map(item => (
                                <option key={item.id} value={item.id}>
                                {item.zipcode.zipcode}
                                </option>
                            ))}
                            </select>

                            <select
                            // value={staff.address_id}
                            // onChange={(ev) =>
                            //     setStaff({ ...staff, address_id: ev.target.value })
                            // }
                            >
                            <option value="">Province</option>
                            {address.map(item => (
                                <option key={item.id} value={item.id}>
                                {item.zipcode.province}
                                </option>
                            ))}
                            </select>

                            <select
                            // value={staff.address_id}
                            // onChange={(ev) =>
                            //     setStaff({ ...staff, address_id: ev.target.value })
                            // }
                            >
                            <option value="">City</option>
                            {address.map(item => (
                                <option key={item.id} value={item.id}>
                                {item.zipcode.city}
                                </option>
                            ))}
                            </select>
                            </div>

                            <div>
                                <label htmlFor=""></label>
                        <select
                            value={staff.address_id}
                            onChange={(ev) =>
                                setStaff({ ...staff, address_id: ev.target.value })
                            }
                            >
                            <option value="">Barangay</option>
                            {address.map(item => (
                                <option key={item.id} value={item.id}>
                                {item.barangay}
                                </option>
                            ))}
                            </select>
                            </div>

                            <div style={{textAlign:"center"}}>
                        <button className="btn">Save</button>
                        <Link className="btn" to="/staffs">Back</Link>
                        </div>

                    </form>
                )}
            </div>
            </div>
            </div>
        </div>
    );
}
