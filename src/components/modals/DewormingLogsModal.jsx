import React, { useEffect, useState } from "react";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export default function DewormingLogsModal(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    pets,
    petid,
    deworminglog,
    setDeworminglog,
    errors,
    isUpdate,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    // Create a copy of the deworminglog object and update the specified field
    const updatedLogs = { ...deworminglog, [fieldName]: value };
    // Update the deworminglog object with the updated value
    setDeworminglog(updatedLogs);
  };

  const [date, setDate] = useState(new Date());

  return (
    <>
      {/* <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress color="inherit" />
      </Backdrop> */}

      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            {isUpdate ? "Update Deworming" : "Add Deworming"}
            <IconButton onClick={onClick} style={{ float: "right" }}>
              <Close color="primary"></Close>
            </IconButton>
          </DialogTitle>
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
            <form onSubmit={(e) => onSubmit(e)} on>
              <Stack spacing={2} margin={2}>
                <FormControl>
                  <InputLabel>Pet</InputLabel>
                  <Select
                    label="Pet"
                    value={deworminglog.pet_id || ""}
                    onChange={(ev) =>
                      handleFieldChange("pet_id", ev.target.value)
                    }
                    disabled={isUpdate}
                    required
                  >
                    {pets.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  variant="outlined"
                  id="Weight"
                  label="Weight"
                  type="number"
                  sx={{ width: "30%" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                  }}
                  value={deworminglog.weight}
                  onChange={(ev) =>
                    handleFieldChange("weight", ev.target.value)
                  }
                  required
                />
                <TextField
                  variant="outlined"
                  id="Description"
                  label="Description"
                  value={deworminglog.description}
                  onChange={(ev) =>
                    handleFieldChange("description", ev.target.value)
                  }
                  required
                />

                <FormControl>
                  <InputLabel>Administered</InputLabel>
                  <Select
                    label="Administered"
                    value={deworminglog.administered || ""}
                    onChange={(ev) =>
                      handleFieldChange("administered", ev.target.value)
                    }
                    required
                  >
                    <MenuItem value="Doctor Reina">Doctor Reina</MenuItem>
                    <MenuItem value="Doctor Philip">Doctor Philip</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Return"
                  variant="outlined"
                  id="Return"
                  type="date"
                  value={deworminglog.return || ``}
                  onChange={(ev) =>
                    handleFieldChange("return", ev.target.value)
                  }
                  required
                />

                <Button color="primary" variant="contained" type="submit">
                  Save
                </Button>
              </Stack>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
