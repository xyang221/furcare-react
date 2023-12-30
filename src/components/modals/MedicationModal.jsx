import React from "react";
import {
  Button,
  Alert,
  Backdrop,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  DialogActions,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export default function MedicationModal(props) {
  const {
    open,
    onClose,
    onClick,
    onSubmit,
    loading,
    medicines,
    medication,
    setMedication,
    errors,
    selectedCat,
    handleCategoryChange,
    category,
    isUpdate
  } = props;

  const handleFieldChange = (fieldName, value) => {
    const updatedMedication = { ...medication, [fieldName]: value };
    setMedication(updatedMedication);
  };

  const handleFieldChangePrice = (fieldName, value, selectedMedicine) => {
    const updatedMedication = {
      ...medication,
      [fieldName]: value,
      unit_price: selectedMedicine.price,
    };
    setMedication(updatedMedication);
  };

  return (
    <>
      <Backdrop open={loading} style={{ zIndex: 999 }}>
        <CircularProgress />
      </Backdrop>
      {!loading && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>
            Medication
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
            <Stack spacing={2} margin={2}>
              <FormControl>
                <InputLabel>Medicine Category</InputLabel>
                <Select
                  label="Medicine Category"
                  value={selectedCat || ""}
                  onChange={handleCategoryChange}
                  required
                  fullWidth
                >
                  {category.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <InputLabel>Medicine</InputLabel>
                <Select
                  label="Medicine"
                  value={medication.medicine_id || ""}
                  onChange={(ev) =>
                    handleFieldChangePrice(
                      "medicine_id",
                      ev.target.value,
                      medicines.find((item) => item.id === ev.target.value) // Get the selected medicine
                    )
                  }
                  required
                  fullWidth
                >
                  {medicines.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ₱{item.price}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                value={medication.quantity || ""}
                onChange={(ev) =>
                  handleFieldChange("quantity", ev.target.value)
                }
                label="quantity"
                type="number"
                required
              />
              <TextField
                value={medication.dosage || ""}
                onChange={(ev) => handleFieldChange("dosage", ev.target.value)}
                label="dosage"
                required
              />
              <TextField
                value={medication.description || ""}
                onChange={(ev) =>
                  handleFieldChange("description", ev.target.value)
                }
                multiline
                rows={2}
                label="description"
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button variant="contained" onClick={onSubmit} color="success">
              {isUpdate ? "save" : "add"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
