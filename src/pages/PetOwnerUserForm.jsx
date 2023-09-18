import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function PetOwnerUserForm() {
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
    });

    const [petowner, setPetowner] = useState({
        id: null,
        // user_id: userID,
        firstname: '',
        lastname: '',
        contact_num: '',
        address_id: null,
    });

    const [address,setAddress]= useState([]);


    // useEffect(() => {
    //     if (id) {
    //         setLoading(true);
    //         axiosClient.get(`/users/${id}`)
    //             .then(({ data }) => {
    //                 setLoading(false);
    //                 setUser(data);
    //             })
    //             .catch(() => {
    //                 setLoading(false);
    //             });
    //         }
    //     }, [id]);

    const onSubmit = (ev) => {
        ev.preventDefault();
       
            axiosClient.post(`/users`, user)
                .then(() => {
                    setNotification('User successfully created')
                    // history.push('/petowners/new');
                    // navigate(`/petowners/new`);
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
            
            axiosClient.post(`/petowners`, petowner)
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
        
    };

    useEffect(() => {

        axiosClient.get(`/users`)
        .then(({ data }) => {
            setLoading(false);
            setUser(data.data);
        })
        .catch(() => {
            setLoading(false);
        });
        
      axiosClient.get(`/addresses`)
      .then(({ data }) => {
          setLoading(false);
          setAddress(data.data);
      })
      .catch(() => {
          setLoading(false);
      });
  
  
          }, []);
    
    return (
        <div>
            <div className="default-form animated fadeInDown">
                <div className="form">
            {user.id && <h1  className="title">Update User</h1>}
            {!user.id && <h1 className="title">REGISTRATION</h1>}

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

                            <select
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
                            </select>
                            </div>
                           
                    
                     <h2>Create An Account</h2>
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
