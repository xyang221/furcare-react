import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function PetOwners() {
    const { id } = useParams();
    const [petowner, setPetowner] = useState([]);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(false);

    const { setNotification } = useStateContext();

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
            console.log(pets)


            axiosClient.get(`/petowners/${id}/pets`)
            .then(({ data }) => {
                setLoading(false);
                setPets(data.data);
            })
            .catch(() => {
                setLoading(false);
            });

    }

        }, [id]);

    const onDelete = (p) => {
        if (!window.confirm("Are you sure?")) {
            return;
        }

        axiosClient.delete(`/pets/${p.id}`).then(() => {
            setNotification("Pet Owner deleted");
            // getPetowners();
        });
    };
    // console.log(pets)

    return (
        <div>
            <div className="default-form animated fadeInDown">
                <div className="form">
                {/* <h1 className="title">{petowners.firstname}'s PETS</h1> */}
                <h1 className="title">PETS</h1>
                    <Link to={`/petowners/${id}/pets/new`} className="btn">
                       Add Pet
                    </Link>
                    <Link to={`/petowners/`+petowner.id} className="btn-edit" > Back </Link>

                    <div className="card animated fadeInDown">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Birthdate</th>
                                    <th>Gender</th>
                                    <th>Breed</th>
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
                                    {pets.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.id}</td>
                                            <td>{p.name}</td>
                                            <td>{p.birthdate}</td>
                                            <td>{p.gender}</td>
                                            <td>{p.breed.breed}</td>
                                            <td>
                                                <Link to={`/pets/`+p.id} className="btn-edit" > Edit </Link>
                                                <button onClick={() => onDelete(p)} className="btn-delete" > Delete </button>
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
