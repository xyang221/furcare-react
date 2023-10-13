import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { Link, useParams } from "react-router-dom";
import {
  Alert,
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { Close, Delete, Edit } from "@mui/icons-material";

export default function StaffEdit(props) {
  const { open, onClose, onClick } = props;

  const { id } = useParams();
  const [errors, setErrors] = useState(null);
  const [notification, setNotification] = useState("");
  const [staff, setStaff] = useState({
    id: null,
    firstname: "",
    lastname: "",
    contact_num: "",
  });

  const [address, setAddress] = useState({
    // id: null,
    zipcode_id: null,
    barangay: "",
    zone: "",
  });

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [paID, setpaID] = useState(null);

  const getstaffs = () => {
    if (id) {
      setLoading(true);
      axiosClient
        .get(`/staffs/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setStaff(data);
          setpaID(data.address.id);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  const getAddress = () => {
    if (paID) {
      setLoading(true);
      axiosClient
        .get(`/addresses/${paID}`)
        .then(({ data }) => {
          setLoading(false);
          setAddress(data);
          setValue(data.zipcode.id);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  const onSubmit = () => {
    axiosClient
      .put(`/staffs/${id}`, staff)
      .then(() => {
        setNotification("staff successfully updated");
        navigate("/staffs");
      })
      .catch((err) => {
        setErrors(err);
      });
  };

  const [zipcode, setZipcode] = useState([]);

  const getZipcodes = () => {
    axiosClient
      .get("/zipcodes")
      .then(({ data }) => {
        setZipcode(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getstaffs();
    getAddress();
    getZipcodes();
  }, [id, paID]);

  return (
    <>
    <Backdrop open={loading} style={{ zIndex: 999 }}>
    <CircularProgress color="inherit" />
  </Backdrop>

  {!loading && ( <Dialog
      // fullScreen
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
     {staff.id && ( <DialogTitle>
        Update Staff
        <IconButton onClick={onClick} style={{ float: "right" }}>
          <Close color="primary"></Close>
        </IconButton>{" "}
      </DialogTitle>)}

      {!staff.id && ( <DialogTitle>
        Register Staff
        <IconButton onClick={onClick} style={{ float: "right" }}>
          <Close color="primary"></Close>
        </IconButton>{" "}
      </DialogTitle>)}

     <DialogContent>
        {errors && (
          <Box>
            {Object.keys(errors).map((key) => (
              <Alert severity="error" key={key}>
                {errors[key][0]}
              </Alert>
            ))}
          </Box>
        )}

{/* {loading && (<Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>)} */}

        <Stack spacing={2} margin={2}>
          <TextField
            variant="outlined"
            id="firstname"
            label="Firstname"
            value={staff.firstname}
            onChange={(ev) =>
              setStaff({ ...staff, firstname: ev.target.value })
            }
          />
          <TextField
            variant="outlined"
            id="Lastname"
            label="Lastname"
            value={staff.lastname}
            onChange={(ev) =>
              setStaff({ ...staff, lastname: ev.target.value })
            }
          />
          <TextField
            variant="outlined"
            id="Contact Number"
            label="Contact Number"
            type="number"
            value={staff.contact_num}
            onChange={(ev) =>
              setStaff({ ...staff, contact_num: ev.target.value })
            }
          />
          <TextField
            id="Zone"
            label="Zone"
            value={address.zone}
            onChange={(ev) => setAddress({ ...address, zone: ev.target.value })}
          />
          <TextField
            id="Barangay"
            label="Barangay"
            value={address.barangay}
            onChange={(ev) =>
              setAddress({ ...address, barangay: ev.target.value })
            }
          />
          {/* <Autocomplete
            sx={{ width: "100%" }}
            getOptionLabel={(option) =>
              `${option.area}, ${option.province}, ${option.zipcode}`
            }
            options={zipcode}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            noOptionsText="Not Found"
            renderOption={(props, option) => (
              <li {...props}>
                {option.area}, {option.province}, {option.zipcode}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="City, Province, Zipcode" />
            )}
            onChange={(event, newValue) => {
              setValue(newValue);
              setAddress((prevAddress) => ({
                ...prevAddress,
                zipcode_id: newValue ? newValue.id : prevAddress.zipcode_id,
              }));
            }}
            value={value}
          /> */}
          
          <Button
            color="primary"
            variant="contained"
            onClick={() => onSubmit(staff)}
          >
            Save
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>)}
  
  </>
  );
}
