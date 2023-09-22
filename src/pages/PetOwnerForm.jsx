import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { Stack, Autocomplete, TextField, Box } from '@mui/material';

export default function PetOwnerForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const { setNotification } = useStateContext();

    const [address, setAddress] = useState([]);
    const [value, setValue] = useState(null)

    const [petowner, setPetowner] = useState({
        id: null,
        firstname: '',
        lastname: '',
        contact_num: '',
        zipcode_id: null,
        barangay: '',
        zone: '',
    });

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
                    handleErrors(err);
                });
        } else {
            axiosClient.post(`/users/${id}/petowners/new`, petowner)
                .then(() => {
                    setNotification("Pet Owner successfully created");
                    navigate('/petowners');
                })
                .catch((err) => {
                    handleErrors(err);
                });
        }
    };

    const getZipcodes = () => {
        axiosClient.get('/zipcodes')
            .then(({ data }) => {
                setAddress(data.data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getZipcodes();
    }, []);

    const handleErrors = (err) => {
        const response = err.response;
        if (response && response.status === 422) {
            setErrors(response.data.errors);
        }
    };

    return (
        <div>
            <div className="default-form animated fadeInDown">
                <div className="form">
                    {petowner.id ? <h1 className="title">UPDATE PET OWNER</h1> : <h1 className="title">REGISTRATION</h1>}

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
                                <h2>Pet Owner Details</h2>

                                <div>
                                    <label htmlFor="firstname">First Name:</label>
                                    <input
                                        type="text"
                                        value={petowner.firstname}
                                        onChange={(ev) =>
                                            setPetowner({ ...petowner, firstname: ev.target.value })
                                        }
                                        placeholder="First Name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastname">Last Name:</label>
                                    <input
                                        type="text"
                                        value={petowner.lastname}
                                        onChange={(ev) =>
                                            setPetowner({ ...petowner, lastname: ev.target.value })
                                        }
                                        placeholder="Last Name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contact_num">Contact Number:</label>
                                    <input
                                        type="number"
                                        value={petowner.contact_num}
                                        onChange={(ev) =>
                                            setPetowner({ ...petowner, contact_num: ev.target.value })
                                        }
                                        placeholder="Contact Number"
                                    />
                                </div>

                                <Stack sx={{ width: 300 }} spacing={5}>
                                    <Autocomplete
                                        getOptionLabel={(address) => `${address.area}, ${address.province}`}
                                        options={address}
                                        isOptionEqualToValue={(option, value) => option.area === value.area}
                                        noOptionsText="Not Available"
                                        renderOption={(props, address) => (
                                            <Box component="li" {...props} key={address.id}>
                                                {address.area}, {address.province}
                                            </Box>
                                        )}
                                        renderInput={(params) => <TextField {...params} label="Address" />}
                                        onChange={(event, newValue) => {
                                            setValue(newValue);
                                            setPetowner({ ...petowner, zipcode_id: newValue ? newValue.id : null});
                                        }}
                                        value={value}
                                    />
                                </Stack>
                                <input
                                    type="text"
                                    value={petowner.barangay}
                                    onChange={(ev) =>
                                        setPetowner({ ...petowner, barangay: ev.target.value })
                                    }
                                    placeholder="Barangay"
                                />
                                 <input
                                    type="text"
                                    value={petowner.zone}
                                    onChange={(ev) =>
                                        setPetowner({ ...petowner, zone: ev.target.value })
                                    }
                                    placeholder="Zone"
                                />

                                <div style={{ textAlign: "center" }}>
                                    <button className="btn">Save</button>
                                    <button onClick={() => navigate(-1)} className="btn">Back</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
