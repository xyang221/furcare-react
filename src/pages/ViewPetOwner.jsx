import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { Alert, Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import { ArrowBackIos, Edit } from "@mui/icons-material";
import PetOwnerEdit from "../components/modals/PetOwnerEdit";
import PetOwnerPets from "./PetOwnerPets";
import UserEdit from "../components/modals/UserEdit";
import PetOwnerTabs from "../components/PetOwnerTabs";

export default function ViewPetOwner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [notification, setNotification] = useState(null);

  const [petownerdata, setPetownerdata] = useState({
    id: null,
    firstname: "",
    lastname: "",
    contact_num: "",
    address_id: null,
    user_id: null
  });

  const [addressdata, setAddressdata] = useState({
    id: null,
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

  const [zipcode, setZipcode] = useState({
    id:null,
    area: "",
    province: "",
    zipcode: "",
  });

  const [openuser, openuserchange] = useState(false);
  const [openPetowner, openPetownerchange] = useState(false);

  const closepopup = () => {
    openuserchange(false);
    openPetownerchange(false);
  };

  const getPetowner = () => {
    setNotification(null);
    setErrors(null);
    setLoading(true);
    axiosClient
      .get(`/petowners/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setPetownerdata(data);
        setAddressdata(data.address);
        setZipcode(data.address.zipcode);
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

  const [zipcodes, setZipcodes] = useState([]);

  const getZipcodes = () => {
    setLoading(true);
    axiosClient
      .get("/zipcodes")
      .then(({ data }) => {
        setLoading(false);
        setZipcodes(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const [value, setValue] = useState(zipcode.id);
  const [inputValue, setInputValue] = useState('');


  const onEdit = () => {
    getPetowner();
    setErrors(null);
    getZipcodes()
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
      .put(`/petowners/${petownerdata.id}`, petownerdata)
      .then(() => {
        setNotification("Petowner was successfully updated");

        return axiosClient.put(`/addresses/${petownerdata.address_id}`, addressdata);
      })
      .then(() => {
        setLoading(false);
        openPetownerchange(false);
        getPetowner();
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
      .put(`/users/${petownerdata.user_id}`, userdata)
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
    <Paper sx={{
      minWidth: "90%",
      padding: "10px",
      margin: "10px",
    }}>
      <div className="card animate fadeInDown">
        
        <h1 className="title">Pet Owner Details</h1>

        {/* <Box
  component="img"
  sx={{
    height: 233,
    width: 350,
    maxHeight: { xs: 233, md: 167 },
    maxWidth: { xs: 350, md: 250 },
  }}
  alt="The house from the offer."
  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
/> */}
        {/* {loading && <div className="text-center">Loading...</div>} */}
        {notification && <Alert severity="success">{notification}</Alert>}
        {/* {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )} */}

      <p>
        Name: {petownerdata.firstname} {petownerdata.lastname}
      </p>
      <p>
        Address: {addressdata.zone}, {addressdata.barangay}, {zipcode.area}, {zipcode.province}, {zipcode.zipcode}
      </p>
      <p>Contact Number: {petownerdata.contact_num}</p>

        <h2>Mobile Account</h2>
        <p>Username: {userdata.username} </p>
        <p>Email: {userdata.email} </p>

        <Button
          variant="contained"
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
          zipcode={zipcodes}
          errors={errors}
          isUpdate={id}
    //       value={value}
    // setValue={setValue}
    // inputValue={inputValue}
    // setInputValue={setInputValue}
    // options={zipcodes}
        />

        <Button
          variant="contained"
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
          isUpdate={userdata.id}
        />

        <PetOwnerTabs/>
      </div>
    </Paper>
  );
}
