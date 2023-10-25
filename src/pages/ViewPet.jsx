import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import { ArrowBackIos, Edit } from "@mui/icons-material";
import PetsModal from "../components/modals/PetsModal";
import PetTabs from "../components/PetTabs";

export default function ViewPet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [notification, setNotification] = useState(null);

  const [pet, setPet] = useState({
    id: null,
    name: "",
    birthdate: "",
    gender: "",
    color: "",
    qr_code: "",
    petowner_id:null,
    // photo: imageData,
    breed_id: null,
  });

  const [petowner, setPetowner] = useState({
    id: null,
    firtname: "",
    lastname: "",
    contact_num: "",
  });

  const [open, setOpen] = useState(false);

  const closepopup = () => {
    setOpen(false);
  };

  const getPet = () => {
    setNotification(null);
    setErrors(null);
    setLoading(true);
    axiosClient
      .get(`/pets/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setPet(data);
        setPetowner(data.petowner);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const [breeds, setBreeds] = useState([]);

  const getBreeds = () => {
    setLoading(true);
    axiosClient
      .get("/breeds")
      .then(({ data }) => {
        setLoading(false);
        setBreeds(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onEdit = () => {
    getPet();
    setErrors(null);
    getBreeds()
    setOpen(true);
  };

  const addDeworming = () => {
    getPet();
    setErrors(null);
    getBreeds()
    setOpen(true);
  };


  const onSubmit = (ev) => {
    ev.preventDefault();
    if (pet.id) {
      axiosClient
        .put(`/pets/${pet.id}`, pet)
        .then(() => {
          setNotification("Pet was successfully updated");
          setOpen(false)
          getPet();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/petowners/${id}/addpet`, pet)
        .then(() => {
          setNotification("Pet was successfully added");
          setOpen(false)
          getPet();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getPet();
  }, []);

  return (
    <div>
      <br></br>
      <div className="card animate fadeInDown">
        {notification && <Alert severity="success">{notification}</Alert>}

      <p>
        Pet Owner: {petowner.firstname} {petowner.lastname} <br></br> 
        Pet Name: {pet.name}
      </p>
    

        <Button
          variant="contained"
          color="info"
          onClick={() => onEdit()}
        >
          <Typography>Update Pet</Typography> <Edit fontSize="small" />
        </Button>

        <PetsModal
              open={open}
              onClick={closepopup}
              onClose={closepopup}
              // id={petdata.id}
              // setImageData={setImageData}
              onSubmit={onSubmit}
              loading={loading}
              breeds={breeds}
              pet={pet}
              setPet={setPet}
              errors={errors}
              isUpdate={pet.id}
            />

        <Button
          variant="contained"
          color="error"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIos fontSize="small" />
          <Typography>Back</Typography>
        </Button>

        <PetTabs/>

       

      </div>
    </div>
  );
}
