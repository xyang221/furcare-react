import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function ClientServiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();

  const [clientservice, setClientService] = useState({
    id: null,
    date: "",
    deposit: "",
    balance: "",
    rendered_by: "",
    petowner_id: null,
    services_id: null,
  });

  const [petowners, setPetowners] = useState([]);

  const getPetowners = () => {
    setLoading(true);
    axiosClient
      .get("/clientservices")
      .then(({ data }) => {
        setLoading(false);
        setClientService(data.data);
      })
      .catch(() => {
        setLoading(false);
      });

    axiosClient
      .get("/petowners")
      .then(({ data }) => {
        setLoading(false);
        setPetowners(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getPetowners();
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
        .post(`/clientservices`, clientservice)
        .then(() => {
          setNotification("clientservice successfully created");
          navigate("/clientservices");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    }
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
            <label htmlFor="">Date</label>
            <input
              type="date"
              value={clientservice.date}
              onChange={(ev) =>
                setClientService({ ...clientservice, date: ev.target.value })
              }
              placeholder="Date"
            />

            <input
              type="number"
              value={clientservice.deposit}
              onChange={(ev) =>
                setClientService({ ...clientservice, deposit: ev.target.value })
              }
              placeholder="Deposit"
            />

            <input
              type="text"
              value={clientservice.balance}
              onChange={(ev) =>
                setClientService({ ...clientservice, balance: "scheduled" })
              }
              placeholder="Balance"
            />

            <select
              value={clientservice.petowner_id}
              onChange={(ev) =>
                setClientService({
                  ...clientservice,
                  petowner_id: ev.target.value,
                })
              }
            >
              <option value="">Pet Owner</option>
              {petowners.map((po) => (
                <option key={po.id} value={po.id}>
                  {`${po.firstname} ${po.lastname}`}
                </option>
              ))}
            </select>

            <br></br>
            <button className="btn">Save</button>
            <Link className="btn" to="/clientservices">
              Back
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
