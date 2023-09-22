import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function PetOwnerForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const { setNotification } = useStateContext();
    
    const [petowner, setPetowner] = useState({
        id: null,
        // user_id: userid,
        firstname: '',
        lastname: '',
        contact_num: '',
        address_id: null,
    });

    const [address,setAddress]= useState([]);
 
    useEffect(() => {
        if (id) {
            setLoading(true);
            axiosClient.get(`/petowners/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setPetowner(data);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }, [id]);

   
    const onSubmit = (ev) => {
        ev.preventDefault();
        if (petowner.id) {
            axiosClient.put(`/petowners/${petowner.id}`, petowner)
                .then(() => {
                    setNotification("Petowner successfully updated");
                    navigate('/petowners');
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status == 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient.post(`user/${id}/petowner`, petowner)
                .then(() => {
                    setNotification("Pet Owner successfully created");
                    navigate('/petowners');
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
                {petowner.id && <h1 className="title">UPDATE PET OWNER</h1>}
            {!petowner.id && <h1 className="title">REGISTRATION</h1>}
            
            <div className="card animated fadeInDown" >
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
                        <h2>Pet Owner Details</h2>
                      
                            <div>
                        <label htmlFor="">First Name:</label>
                        <input type="text"
                            value={petowner.firstname}
                            onChange={(ev) =>
                                setPetowner({ ...petowner, firstname: ev.target.value })
                            }
                            placeholder="First Name"
                        />
                        </div>
                        <div>
                        <label htmlFor="">Last Name:</label>
                        <input type="text"
                            value={petowner.lastname}
                            onChange={(ev) =>
                                setPetowner({ ...petowner, lastname: ev.target.value })
                            }
                            placeholder="Last Name"
                        />
                        </div>
                        <div>
                            <label htmlFor="">Contact Number: </label>
                        <input
                            type="number"
                            value={petowner.contact_num}
                            onChange={(ev) =>
                                setPetowner({ ...petowner,
                                    contact_num: ev.target.value,
                                })
                            }
                            placeholder="Contact Number"
                        /></div>

                        <div>  
                        <label htmlFor="address">Address:  </label>
                        <select
                            // value={petowner.address_id}
                            // onChange={(ev) =>
                            //     setPetowner({ ...petowner, address_id: ev.target.value })
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
                            // value={petowner.address_id}
                            // onChange={(ev) =>
                            //     setPetowner({ ...petowner, address_id: ev.target.value })
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
                            // value={petowner.address_id}
                            // onChange={(ev) =>
                            //     setPetowner({ ...petowner, address_id: ev.target.value })
                            // }
                            >
                            <option value="">City</option>
                            {address.map(item => (
                                <option key={item.id} value={item.id}>
                                {item.zipcode.city}
                                </option>
                            ))}
                            </select>
                            <br />

                            <input
                            type="text"
                            value={petowner.contact_num}
                            onChange={(ev) =>
                                setPetowner({ ...petowner,
                                    contact_num: ev.target.value,
                                })
                            }
                            placeholder="Barangay"
                        />

                            <label htmlFor=""></label>
                        <select
                            value={petowner.address_id}
                            onChange={(ev) =>
                                setPetowner({ ...petowner, address_id: ev.target.value })
                            }
                            >
                            <option value=''>Barangay</option>
                            {address.map(item => (
                                <option key={item.id} value={item.id}>
                                {item.barangay}
                                </option>
                            ))}
                            </select>

                            {/* <select
                            value={petowner.address_id}
                            onChange={(ev) =>
                                setPetowner({ ...petowner, address_id: ev.target.value })
                            }
                            >
                            <option value=''>Zone</option>
                            {address.map(item => (
                                <option key={item.id} value={item.id}>
                                {item.barangay}
                                </option>
                            ))}
                            </select> */}
                            </div>
                            <div style={{textAlign:"center"}}>
                        <button className="btn">Save</button>
                        <Link className="btn" to="/petowners">Back</Link>
                        </div>
                    </form>
                )}
                </div>
                </div>
            </div>
        </div>
    );
}
