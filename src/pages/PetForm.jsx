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
        breed_id: null,
        petowner_id: null,
    });

    const [selectedGender, setSelectedGender] = useState('');
    const [breed, setBreed] = useState([]);

    const [petowners, setPetowners] = useState([]);

    const getPetowners = () => {

        // setLoading(true);
        axiosClient.get('/petowners')
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
            axiosClient.get(`/pets/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setPet(data);
                })
                .catch(() => {
                    setLoading(false);
                });
    }
    getPetowners();

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
            axiosClient.put(`/pets/${pet.id}`, pet)
                .then(() => {
                    setNotification("User successfully updated");
                    navigate("/pets");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status == 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient.post(`/pets`, pet)
                .then(() => {
                    setNotification("User successfully created");
                    navigate("/pets");
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
              <div className="default-form animated fadeInDown">
                <div className="form">
            {pet.id && <h1 className="title">UPDATE PET </h1>}
            {!pet.id && <h1 className="title">ADD PET</h1>}

            <div className="card animated fadeInDown">
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

                        <div>
                        <label >Pet Owner:</label>
                      <select
                            value={pet.petowner_id}
                            onChange={(ev) =>
                                setPet({ ...pet, petowner_id: ev.target.value })
                            }
                            >
                            <option > </option>
                            {petowners.map(po => (
                                <option key={po.id} value={po.id}>
                                {`${po.firstname} ${po.lastname}`}
                                </option>
                            ))}
                            </select>
                            </div>

                        <div>
                        <label htmlFor="">Photo:</label>
                        <input
                            type="text"
                            value={pet.photo}
                            onChange={(ev) =>
                                setPet({ ...pet, photo: ev.target.value })
                            }
                        />   
                        </div>

                        <div>
                        <label htmlFor="">Pet Name:</label>
                        <input
                            type="text"
                            value={pet.name}
                            onChange={(ev) =>
                                setPet({ ...pet, name: ev.target.value })
                            }
                            placeholder="Pet Name"
                        />

                        <label htmlFor="">Gender:</label>
                        <select
                            value={pet.gender}
                            onChange={(ev) =>
                                setPet({ ...pet, gender: ev.target.value })
                            }
                            >
                            <option ></option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            </select>
                        
                        </div>

                        <div>
                        <label htmlFor="">Birthdate:</label>
                        <input
                            type="date"
                            value={pet.birthdate}
                            onChange={(ev) =>
                                setPet({ ...pet, birthdate: ev.target.value })
                            }
                            placeholder="Birthdate"
                        />

                            <label htmlFor="">Specie:</label>
                            <select
                            // value={pet.breed_id}
                            // onChange={(ev) =>
                            //     setPet({ ...pet, breed_id: ev.target.value })
                            // }
                            >
                            <option value=""></option>
                            {breed.map(b => (
                                <option key={b.id} value={b.id}>
                                {b.specie.specie}
                                </option>
                            ))}
                            </select>

                        </div>

                        <div>
                        <label htmlFor="">Color:</label>
                        <input
                            type="text"
                            value={pet.color}
                            onChange={(ev) =>
                                setPet({ ...pet, color: ev.target.value })
                            }
                            placeholder="Color"
                        />

                        <label htmlFor="">Breed:</label>
                        <select
                            value={pet.breed_id}
                            onChange={(ev) =>
                                setPet({ ...pet, breed_id: ev.target.value })
                            }
                            >
                            <option value=""></option>
                            {breed.map(b => (
                                <option key={b.id} value={b.id}>
                                {b.breed}
                                </option>
                            ))}
                            </select>

                        </div>
                        
                        <input
                            type="text"
                            value={pet.qr_code}
                            onChange={(ev) =>
                                setPet({ ...pet, qr_code: ev.target.value })
                            }
                            placeholder="QR Code"
                        />
                      
                        <button className="btn">Save</button>
                        <Link className="btn" to="/pets">Back</Link>
                    </form>
                )}
            </div>
            </div>
            </div>
            </div>
    );
}
