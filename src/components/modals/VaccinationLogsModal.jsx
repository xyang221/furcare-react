import React, { useEffect, useState } from "react";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Checkbox,
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
  TableCell,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export default function VaccinationLogsModal(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    pets,
    vaccination,
    setVaccination,
    againsts,
    vets,
    errors,
    pet,
    isUpdate,
  } = props;

  const handleFieldChange = (fieldName, value) => {
    // Create a copy of the vaccination object and update the specified field
    const updatedLogs = { ...vaccination, [fieldName]: value };
    // Update the vaccination object with the updated value
    setVaccination(updatedLogs);
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
            {isUpdate ? "Update Vaccination" : "Add Vaccination"}
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
            <form onSubmit={(e) => onSubmit(e)}>
              <Stack spacing={2} margin={2}>
              {isUpdate ?  <Typography variant="body1">
                  Date: {vaccination.date}
                </Typography> :   <Typography variant="body1">
                  Date: {date.toDateString()}
                </Typography>}



                <FormControl>
                  <InputLabel>Pet</InputLabel>
                  <Select
                    label="Pet"
                    value={vaccination.pet_id || ""}
                    onChange={(ev) =>
                      handleFieldChange("pet_id", ev.target.value)
                    }
                    readOnly={isUpdate}
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
                  value={vaccination.weight}
                  onChange={(ev) =>
                    handleFieldChange("weight", ev.target.value)
                  }
                  required
                />

                <Box border={1} p={1}>
                  {againsts.map((item) => (
                    <div key={item.id}>
                      <TableCell> {item.acronym} </TableCell>
                      <TableCell> {item.description}</TableCell>
                    </div>
                  ))}

                  <TextField
                    variant="outlined"
                    id="Against"
                    label="Against"
                    value={vaccination.va_againsts || ""}
                    onChange={(ev) =>
                      handleFieldChange("va_againsts", ev.target.value)
                    }
                    fullWidth
                  />
                </Box>

                <TextField
                  variant="outlined"
                  id="Description"
                  label="Description"
                  multiline
                  value={vaccination.description || ""}
                  onChange={(ev) =>
                    handleFieldChange("description", ev.target.value)
                  }
                />

                <FormControl>
                  <InputLabel>Administered</InputLabel>
                  <Select
                    label="Administered"
                    value={vaccination.vet_id || ""}
                    onChange={(ev) =>
                      handleFieldChange("vet_id", ev.target.value)
                    }
                    required
                  >
                    {vets.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.fullname}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Return"
                  variant="outlined"
                  id="Return"
                  type="date"
                  value={vaccination.return || ``}
                  onChange={(ev) =>
                    handleFieldChange("return", ev.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
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
