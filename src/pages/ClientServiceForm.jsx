import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";

export default function ClientServiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();

  const [clientservice, setClientService] = useState({
    id: null,
    deposit: "",
    balance: "",
    rendered_by: "",
    // petowner_id: null,
  });

  const [petowner, setPetowner] = useState([]);

  const getPetowner = () => {
    setLoading(true);
    axiosClient
      .get(`/petowners/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setPetowner(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const [pets, setPets] = useState([]);
  const getPetownerPets = () => {
    // setLoading(true);
    axiosClient
      .get(`/petowners/${id}/pets`)
      .then(({ data }) => {
        // setLoading(false);
        setPets(data.data);
      })
      .catch(() => {
        // setLoading(false);
      });
  };

  useEffect(() => {
    getPetowner()
    getPetownerPets()
  }, []);

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (clientservice.id) {
      axiosClient
        .put(`/clientservices/${clientservice.id}`, clientservice)
        .then(() => {
          setNotification("clientservice successfully updated");
          navigate("/clientservices");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/clientservices/petowner/${id}`, clientservice)
        .then(() => {
          setNotification("The Consent For Treatment form was successfully saved.");
          navigate(`/admin/services/petowner/${id}/avail/admission/treatment`);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  const [date, setDate] = useState(new Date());

  const handleFieldChange = (fieldName, value) => {
    // Create a copy of the breed object and update the specified field
    const updatedDiagnosis = { ...clientservice, [fieldName]: value };
    // Update the breed object with the updated value
    setClientService(updatedDiagnosis);
  };


  return (
    <div>
      {clientservice.id && <h1 className="title">Update Client Service</h1>}
      {!clientservice.id && (
        <h1 className="title">Client Service (Consent For Treatment)</h1>
      )}

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
            <Typography variant="h6">
                Date: {date.toDateString()}{" "}
              </Typography>

              <Typography variant="h6">
                Client: {petowner.firstname}  {petowner.lastname}
              </Typography>

          <br></br>
            <TextField
              type="number"
              value={clientservice.deposit || ""}
              onChange={(ev) =>
                handleFieldChange("deposit", ev.target.value)
              }
              label="Deposit"
            />

            {/* <TextField
              type="text"
              value={clientservice.balance || ""}
              onChange={(ev) =>
                handleFieldChange("balance", ev.target.value)
              }
              placeholder="Balance"
            /> */}

            <TextField
              type="text"
              value={clientservice.rendered_by || ""}
              onChange={(ev) =>
                handleFieldChange("rendered_by", ev.target.value)
              }
              label="Rendered by"
            />

            <br></br>
            <Button
              color="primary"
              variant="contained"
              onClick={onSubmit}
            >
              Save
            </Button>
           
          </form>
        )}
      </div>
    </div>
  );
}
