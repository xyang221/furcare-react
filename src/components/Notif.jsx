import { Stack, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";

export default function Notif(props) {
  const { open, notification } = props;
  const [snackbarOpen, setSnackbarOpen] = useState(open);

  useEffect(() => {
    setSnackbarOpen(open);
    if (open) {
      const timer = setTimeout(() => {
        setSnackbarOpen(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {notification}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
