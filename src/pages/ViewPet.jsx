import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowBackIos, Edit } from "@mui/icons-material";
import PetsModal from "../components/modals/PetsModal";
import PetTabs from "../components/PetTabs";
import UploadImage from "../components/UploadImage";

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
    petowner_id: null,
    photo: null,
    breed_id: null,
  });

  const [petowner, setPetowner] = useState([]);
  const [petowners, setPetowners] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(false);

  const getPetowners = () => {
    axiosClient
      .get(`/petowners`)
      .then(({ data }) => {
        setPetowners(data.data);
      })
      .catch(() => {});
  };

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

  const getBreeds = () => {
    axiosClient
      .get("/breeds")
      .then(({ data }) => {
        setBreeds(data.data);
      })
      .catch(() => {});
  };

  const onEdit = () => {
    getPet();
    setErrors(null);
    getBreeds();
    setOpen(true);
    getPetowners();
  };

  const addDeworming = () => {
    getPet();
    setErrors(null);
    getBreeds();
    setOpen(true);
  };

  const onSubmit = (ev) => {
    ev.preventDefault();

    if (pet.id) {
      axiosClient
        .put(`/pets/${pet.id}`, pet)
        .then(() => {
          setNotification("Pet was successfully updated");
          setOpen(false);
          getPet();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      if (!pet.photo) {
        setError("Please select an image to upload.");
        return;
      }

      const formData = new FormData();
      formData.append("photo", pet.photo);

      axiosClient
        .post(`/petowners/${pet.petowner_id}/addpet`, pet, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          setNotification("Pet was successfully added");
          setOpen(false);
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

  const handleImage = (e) => {
    const selectedFile = e.currentTarget.files?.[0] || null;

    if (selectedFile) {
      // Validate the file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/svg+xml",
      ];
      if (allowedTypes.includes(selectedFile.type)) {
        setPet((prevImage) => ({
          ...prevImage,
          photo: selectedFile,
        }));
        setError(null);
      } else {
        setError(
          "The selected file must be of type: jpg, png, jpeg, gif, svg."
        );
      }
    }
  };

  const uploadImage = () => {
    setError(null);
    setImage(true);
  };

  const closeuploadImage = () => {
    setImage(false);
  };

  useEffect(() => {
    getPet();
  }, []);

  return (
    <div>
      <br></br>
      <div className="card animate fadeInDown">
        {notification && <Alert severity="success">{notification}</Alert>}
        <Box display="flex" flexDirection="column">
          <Typography
            component={Link}
            to={`/admin/petowners/` + petowner.id + `/view`}
          >
            {petowner.firstname}
          </Typography>
          <Typography> / {pet.name}</Typography>
        </Box>
        <Divider />
        <img src={`http://localhost:8000/` + pet.photo} height="100" />
        <IconButton variant="contained" color="info" onClick={uploadImage}>
          <Edit fontSize="small" />
        </IconButton>

        <UploadImage
          onClick={closeuploadImage}
          onClose={closeuploadImage}
          open={image}
        />
        <h2>
          Pet Details
          <IconButton variant="contained" color="info" onClick={() => onEdit()}>
            <Edit fontSize="small" />
          </IconButton>
        </h2>
        <p>
          Pet Owner: {petowner.firstname} {petowner.lastname} <br></br>
          Pet Name: {pet.name}
        </p>

        <PetsModal
          open={open}
          onClick={closepopup}
          onClose={closepopup}
          // id={petdata.id}
          onSubmit={onSubmit}
          loading={loading}
          breeds={breeds}
          pet={pet}
          setPet={setPet}
          petowners={petowners}
          petownerid={pet.petowner_id}
          errors={errors}
          isUpdate={pet.id}
          addImage={true}
          handleImage={handleImage}
        />

        {/* <PetsModal
          open={image}
          onClick={closepopup}
          onClose={closepopup}
          handleImage={handleImage}
              error={error}
        /> */}

        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar
            open={notification}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert severity="success" sx={{ width: "100%" }}>
              {notification}
            </Alert>
          </Snackbar>
        </Stack>

        <PetTabs />
      </div>
    </div>
  );
}
