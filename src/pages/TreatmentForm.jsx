import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";

export default function TreatmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();

  const [treatment, setTreatment] = useState({
    id: null,
    diagnosis: "",
    body_weight: "",
    heart_rate:"",
    mucous_membrane:"",
    pr_prealbumin:"",
    temp:"",
    respiration_rate:"",
    caspillar_refill_time:"",
    body_condition_Score:"",
    fluid_rate:"",
    comments:""
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


  const getPetowners = () => {
    setLoading(true);
    axiosClient
      .get("/treatments")
      .then(({ data }) => {
        setLoading(false);
        setTreatment(data.data);
      })
      .catch(() => {
        setLoading(false);
      });

    // axiosClient
    //   .get("/petowners")
    //   .then(({ data }) => {
    //     setLoading(false);
    //     setPetowners(data.data);
    //   })
    //   .catch(() => {
    //     setLoading(false);
    //   });
  };

  useEffect(() => {
    getPetowner()
    getPetownerPets()
    // getPetowners();
  }, []);

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (treatment.id) {
      axiosClient
        .put(`/treatments/${treatment.id}`, treatment)
        .then(() => {
          setNotification("treatment successfully updated");
          navigate("/treatments");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/treatments/petowner/${id}`, treatment)
        .then(() => {
          setNotification("treatment successfully created");
          navigate(`/admin/services/petowner/${id}/avail/admission`);
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
    const updatedDiagnosis = { ...treatment, [fieldName]: value };
    // Update the breed object with the updated value
    setTreatment(updatedDiagnosis);
  };


  return (
    <div>
      {!treatment.id && (
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

              <FormControl>
                  <InputLabel>Pet</InputLabel>
                  <Select
                    label="Pet"
                    value={treatment.pet_id || ""}
                    onChange={(ev) =>
                      handleFieldChange("pet_id", ev.target.value)
                    }
                  >
                    {pets.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
          <br></br>
            <TextField
              type="number"
              value={treatment.deposit}
              onChange={(ev) =>
                handleFieldChange("deposit", ev.target.value)
              }
              placeholder="Deposit"
            />

            <TextField
              type="text"
              value={treatment.balance}
              onChange={(ev) =>
                handleFieldChange("balance", ev.target.value)
              }
              placeholder="Balance"
            />

<TextField
              type="text"
              value={treatment.rendered_by}
              onChange={(ev) =>
                handleFieldChange("rendered_by", ev.target.value)
              }
            />

            <br></br>
            <Button
              color="primary"
              variant="contained"
              onClick={onSubmit}
            >
              Avail
            </Button>
           
          </form>
        )}
      </div>
    </div>
  );
}
