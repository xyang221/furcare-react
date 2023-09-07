import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function PetForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const { setNotification } = useStateContext();
    const [pet, setPet] = useState({
        id: null,
        name: '',
        birthdate: '',
        gender: '',
        color: '',
        qr_code: '',
        photo: '',
        breed_id: null
    });

    const [selectedGender, setSelectedGender] = useState('');
    const [breed, setBreed] = useState([]);

    useEffect(() => {
    if (id) {
            setLoading(true);
            axiosClient.get(`/petowners/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setPet(data);
                })
                .catch(() => {
                    setLoading(false);
                });
    }
        }, [id]);

    //     const getAddress = () => {
    //         setLoading(true);
    //         axiosClient.get('/addresses')
    //             .then(({ data }) => {
    //                 setLoading(false);
    //                 setAddress(data.data);
    //             })
    //             .catch(() => {
    //                 setLoading(false);
    //             });
    //     };
    // }

    const onSubmit = (ev) => {
        ev.preventDefault();
        if (pet.id) {
            axiosClient.put(`/pet/${pet.id}`, pet)
                .then(() => {
                    setNotification("User successfully updated");
                    navigate("/pet");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status == 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient.post(`/pet`, pet)
                .then(() => {
                    setNotification("User successfully created");
                    navigate("/pet");
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

        axiosClient.get(`/breeds`)
        .then(({ data }) => {
            setLoading(false);
            setBreed(data.data);
        })
        .catch(() => {
            setLoading(false);
        });
  
          }, []);

    return (
        <div>
            {pet.id && <h1 className="title">Update Pet: </h1>}
            {!pet.id && <h1 className="title">Add Pet</h1>}

            <div className="card animate fadeInDown">
                {loading && <div className="text-center">Loading...</div>}
                {errors && (
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}
                {!loading && (
                    <form onSubmit={onSubmit}>
                       
                        <h2>Pet Details</h2>
                        <input
                            type="file"
                            value={pet.photo}
                            onChange={(ev) =>
                                setPet({ ...pet, photo: ev.target.value })
                            }
                        />
                        <input
                            type="text"
                            value={pet.name}
                            onChange={(ev) =>
                                setPet({ ...pet, name: ev.target.value })
                            }
                            placeholder="Pet Name"
                        />
                        <input
                            type="date"
                            value={pet.birthdate}
                            onChange={(ev) =>
                                setPet({ ...pet, birthdate: ev.target.value })
                            }
                            placeholder="Birthdate"
                        />
                        {/* <label>Gender</label> */}
                        <select
                            value={pet.gender}
                            onChange={(ev) =>
                                setPet({ ...pet, gender: ev.target.value })
                            }
                            >
                            <option >Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            </select>

                            <select
                            // value={pet.breed_id}
                            // onChange={(ev) =>
                            //     setPet({ ...pet, breed_id: ev.target.value })
                            // }
                            >
                            <option value="">Specie</option>
                            {breed.map(b => (
                                <option key={b.id} value={b.id}>
                                {b.specie.specie}
                                </option>
                            ))}
                            </select>

                            {/* <label htmlFor="Breed">breed</label> */}
                        <select
                            value={pet.breed_id}
                            onChange={(ev) =>
                                setPet({ ...pet, breed_id: ev.target.value })
                            }
                            >
                            <option value="">Breed</option>
                            {breed.map(b => (
                                <option key={b.id} value={b.id}>
                                {b.breed}
                                </option>
                            ))}
                            </select>
                        
                        <input
                            type="text"
                            value={pet.qr_code}
                            onChange={(ev) =>
                                setPet({ ...pet, qr_code: ev.target.value })
                            }
                            placeholder="QR Code"
                        />
                      
                        <button className="btn">Save</button>
                        <Link className="btn" to="/petowners">Back</Link>
                        //add next page to register the client to mobile app
                    </form>
                )}
            </div>
        </div>
    );
}
