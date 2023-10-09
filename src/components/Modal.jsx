import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

const Modaltry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();
  const [role, setRole] = useState({
    id: null,
    role: "",
    description: "",
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient
        .get(`/roles/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setRole(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (role.id) {
      axiosClient
        .put(`/roles/${role.id}`, role)
        .then(() => {
          setNotification("role successfully updated");
          navigate(`/roles`);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status == 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/roles`, role)
        .then(() => {
          setNotification("role successfully created");
          navigate(`/roles`);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  const [open, openchange] = useState(false);
  const functionopenpopup = () => {
    openchange(true);
  };
  const closepopup = () => {
    openchange(false);
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h1>MUI - DIALOG</h1>
      <Button onClick={functionopenpopup} color="primary" variant="contained">
        Open Popup
      </Button>
      <Dialog
        // fullScreen
        open={open}
        onClose={closepopup}
        fullWidth
        maxWidth="sm"
      >
        {role.id && (
          <DialogTitle>
            Update Role
            <IconButton onClick={closepopup} style={{ float: "right" }}>
              <CloseIcon color="primary"></CloseIcon>
            </IconButton>{" "}
          </DialogTitle>
        )}
        {!role.id && (
          <DialogTitle>
            New Role
            <IconButton onClick={closepopup} style={{ float: "right" }}>
              <CloseIcon color="primary"></CloseIcon>
            </IconButton>{" "}
          </DialogTitle>
        )}
        <DialogContent>
          {errors && (
            <Box>
              {Object.keys(errors).map((key) => (
                <Alert key={key}>{errors[key][0]}</Alert>
              ))}
            </Box>
          )}
          {/* <DialogContentText>Do you want remove this user?</DialogContentText> */}
          <Stack spacing={2} margin={2} component="form" onSubmit={onSubmit}>
            <TextField
              variant="outlined"
              id="Role"
              label="Role"
              value={role.role}
              onChange={(ev) => setRole({ ...role, role: ev.target.value })}
            />
              <TextField
              variant="outlined"
              id="Description"
              label="Description"
              value={role.description}
              onChange={(ev) => setRole({ ...role, description: ev.target.value })}
            />
            <Button color="primary" variant="contained">
              Save
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          {/* <Button color="success" variant="contained">Yes</Button>
                    <Button onClick={closepopup} color="error" variant="contained">Close</Button> */}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Modaltry;
