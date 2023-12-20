import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { Alert, Backdrop, Button, CircularProgress, Typography } from "@mui/material";
import { ArrowBackIos, Edit } from "@mui/icons-material";
import PetOwnerEdit from "../components/modals/PetOwnerEdit";
import UserEdit from "../components/modals/UserEdit";

export default function ViewStaff() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [notification, setNotification] = useState(null);

  const [staff, setStaff] = useState({
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
    email: "",
    password: "",
    password_confirmation: "",
    role_id: null,
  });

  // const [staffid, setStaffid] = useState(null);
  // const [addressid, setAddressid] = useState(null);
  // const [userid, setUserid] = useState(null);
  const [zipcode, setZipcode] = useState([]);

  const [openuser, openuserchange] = useState(false);
  const [openStaff, openStaffchange] = useState(false);

  const closepopup = () => {
    openuserchange(false);
    openStaffchange(false);
  };

  const getStaff = () => {
    setErrors(null);
    setLoading(true);
    axiosClient
      .get(`/staffs/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setStaff(data);
        // setStaffid(data.id)
        setAddressdata(data.address);
        // setAddressid(data.address_id);
        setZipcode(data.address.zipcode);
        setUserdata(data.user);
        // setUserid(data.user.id);
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
    getStaff()
    setErrors(null)
    openStaffchange(true);
  };

  const onEditUSer = () => {
    getStaff();
    setErrors(null);
    getRoles();
    openuserchange(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    setErrors(null);
    setLoading(true);
    axiosClient
      .put(`/staffs/${staff.id}`, staff)
      .then(() => {
          setNotification("Staff was successfully updated");

        return axiosClient.put(`/addresses/${staff.address_id}`, addressdata);
      })
      .then(() => {
        setNotification("Staff was successfully updated");
        openStaffchange(false);
        getStaff();
      })

      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };

  const onSubmitUser = (e) => {
    e.preventDefault();

    setErrors(null);
    axiosClient
      .put(`/users/${staff.user_id}`, userdata)
      .then(() => {
        setNotification("User was successfully updated");
        openuserchange(false);
        getStaff();
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };

  useEffect(() => {
    getStaff();
  }, []);

  return (
    <div>
      <div className="card animate fadeInDown">
        <h1 className="title">Staff Information</h1>
        {notification && <Alert severity="success">{notification}</Alert>}
        <p>
          Name: {staff.firstname} {staff.lastname}{" "}
        </p>
        <p>
          Address: {addressdata.zone}, {addressdata.barangay}, {zipcode.area}, {zipcode.province}, {zipcode.zipcode}{" "}
        </p>
        <p>Contact Number: {staff.contact_num}</p>

        <h2>User Account</h2>
        <p>Email: {userdata.email} </p>

        <Button
          variant="contained"
          size="small"
          color="info"
          onClick={() => onEdit()}
        >
          <Typography>Update Staff</Typography> <Edit fontSize="small" />
        </Button>

        <PetOwnerEdit
          open={openStaff}
          onClose={closepopup}
          onClick={closepopup}
          // id={id}
          onSubmit={onSubmit}
          loading={loading}
          petowner={staff}
          setPetowner={setStaff}
          address={addressdata}
          setAddress={setAddressdata}
          zipcode={zipcode}
          errors={errors}
          isUpdate={staff.id}
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
          isUpdate={userdata.id}
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

     
      </div>
    </div>
  );
}
