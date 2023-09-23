import { Box, Typography, Stack } from "@mui/material";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import CenterLayout from "./CenterLayout";

export default function Main() {
  return (
    <div>
      <Box>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Sidebar />
          <Navbar />
        </Stack>
      </Box>
    </div>
  );
}
