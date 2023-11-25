import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
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
    user_id: null,
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
    id: null,
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

  // const [value, setValue] = useState(zipcode.id);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState(null);

  const onEdit = () => {
    getPetowner();
    setErrors(null);
    getZipcodes();
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

        return axiosClient.put(
          `/addresses/${petownerdata.address_id}`,
          addressdata
        );
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
    <Paper
      sx={{
        minWidth: "90%",
        padding: "10px",
        margin: "10px",
      }}
    >
      <div className="card animate fadeInDown">
        {/* {loading && <div className="text-center">Loading...</div>} */}
        {notification && <Alert severity="success">{notification}</Alert>}
        {/* {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )} */}

        <Stack flexDirection="row">
          <Stack p={2}>
            <Typography variant="h5">
              Pet Owner Details{" "}
              <IconButton
                variant="contained"
                color="info"
                onClick={() => onEdit()}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Typography>
            <Typography>
              {" "}
              Name: {petownerdata.firstname} {petownerdata.lastname}
            </Typography>
            <Typography>
              {" "}
              Address: {addressdata.zone}, {addressdata.barangay},{" "}
              {zipcode.area}, {zipcode.province}, {zipcode.zipcode}
            </Typography>
            <Typography> Contact Number: +63 {petownerdata.contact_num}</Typography>
          </Stack>

          <Stack p={2}>
            <Typography variant="h5">
              {" "}
              Mobile Account{" "}
              <IconButton
                variant="contained"
                color="info"
                onClick={() => onEditUSer()}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Typography>
            <Typography>Username: {userdata.username}</Typography>
            <Typography>Email: {userdata.email} </Typography>
          </Stack>
        </Stack>

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
          zipcodeid={zipcode.id}
          value={value}
          setValue={setValue}
          // options={zipcodes}
        />
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

        <PetOwnerTabs />
      </div>
    </Paper>
  );
}
