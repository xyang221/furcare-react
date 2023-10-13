import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { Alert, Button, CircularProgress, Typography } from "@mui/material";
import { ArrowBackIos, Edit } from "@mui/icons-material";
import PetOwnerEdit from "../components/modals/PetOwnerEdit";
import PetOwnerPets from "./PetOwnerPets";
import UserEdit from "../components/modals/UserEdit";

export default function ViewPetOwner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [notification, setNotification] = useState(null);

  const [petownerdata, setPetownerdata] = useState({
    // id: null,
    firstname: "",
    lastname: "",
    contact_num: "",
  });

  const [addressdata, setAddressdata] = useState({
    // id: null,
    zipcode_id: null,
    barangay: "",
    zone: "",
  });

  const [userdata, setUserdata] = useState({
    id: null,
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: null,
  });

  const [petownerid, setPetownerid] = useState(null);
  const [addressid, setAddressid] = useState(null);
  const [userid, setUserid] = useState(null);
  const [zipcode, setZipcode] = useState([]);
  

  const [openuser, openuserchange] = useState(false);
  const [openPetowner, openPetownerchange] = useState(false);

  const closepopup = () => {
    openuserchange(false);
    openPetownerchange(false);
  };

  const getPetowner = () => {
    setNotification(null)
    setErrors(null);
    setLoading(true);
    axiosClient
      .get(`/petowners/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setPetownerid(data.id);
        setPetownerdata(data);
        setAddressid(data.address.id);
        setAddressdata(data.address);
        setUserid(data.user.id);
        setUserdata(data.user);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const [roles, setRoles] = useState([]);

  const getRoles = () => {
    setLoading(true);
    axiosClient
      .get("/roles")
      .then(({ data }) => {
        setLoading(false);
        setRoles(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onEdit = () => {
    getPetowner();
    setErrors(null);
    openPetownerchange(true);
  };

  const onEditUSer = () => {
    getPetowner();
    setErrors(null);
    getRoles();
    openuserchange(true);
  };

  const onSubmit = () => {
    setErrors(null);
    setLoading(true);
    axiosClient
      .put(`/petowners/${petownerid}`, petownerdata)
      .then(() => {
          setNotification("Petowner was successfully updated");

        return axiosClient.put(`/addresses/${addressid}`, addressdata);
      })
      .then(() => {
        setLoading(false);
        openPetownerchange(false);
        getPetowner();
        console.log("sucess daw");
      })

      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };

  const onSubmitUser = () => {
    setErrors(null);
    axiosClient
      .put(`/users/${userid}`, userdata)
      .then(() => {
        setNotification("User was successfully updated");
        openuserchange(false);
        getPetowner();
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };

  useEffect(() => {
    getPetowner();
  }, []);

  return (
    <div>
      <div className="card animate fadeInDown">
        <h1 className="title">Pet Owner Details</h1>
        {loading && <div className="text-center">Loading...</div>}
        {notification && <Alert severity="success">{notification}</Alert>}
        {/* {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )} */}
        <p>
          Name: {petownerdata.firstname} {petownerdata.lastname}{" "}
        </p>
        <p>
          Address: {addressdata.zone}, {addressdata.barangay},
          {/* {zipcode.area},{" "} */}
          {/* {address.zipcode.province}, {address.zipcode.zipcode}{" "} */}
        </p>
        <p>Contact Number: {petownerdata.contact_num}</p>

        <h2>Mobile Account</h2>
        <p>Username: {userdata.username} </p>
        <p>Email: {userdata.email} </p>

        <Button
          variant="contained"
          size="small"
          color="info"
          onClick={() => onEdit()}
        >
          <Typography>Update Pet Owner</Typography> <Edit fontSize="small" />
        </Button>

        <PetOwnerEdit
          open={openPetowner}
          onClose={closepopup}
          onClick={closepopup}
          // id={id}
          onSubmit={onSubmit}
          loading={loading}
          petowner={petownerdata}
          setPetowner={setPetownerdata}
          address={addressdata}
          setAddress={setAddressdata}
          zipcode={zipcode}
          errors={errors}
          isUpdate={id}
        />

        <Button
          variant="contained"
          size="small"
          color="info"
          onClick={() => onEditUSer()}
        >
          <Typography>Update User Account</Typography> <Edit fontSize="small" />
        </Button>

        <UserEdit
          open={openuser}
          onClick={closepopup}
          onClose={closepopup}
          // id={userdata.id}
          onSubmit={onSubmitUser}
          loading={loading}
          roles={roles}
          user={userdata}
          setUser={setUserdata}
          errors={errors}
          isUpdate={userid !== null}
        />

        <Button
          variant="contained"
          size="small"
          color="error"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIos fontSize="small" />
          <Typography>Back</Typography>
        </Button>

        <PetOwnerPets />

      </div>
    </div>
  );
}
