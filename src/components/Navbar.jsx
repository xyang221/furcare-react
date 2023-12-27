import styled from "@emotion/styled";
import { Mail, Notifications } from "@mui/icons-material";
import { AppBar, Badge, Box, Toolbar, Typography } from "@mui/material";
import Profile from "./Profile";

export default function Navbar() {
  const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#b71c1c",
  });

  const Icons = styled(Box)(({ theme }) => ({
    display: "flex",
    gap: "20px",
    alignItems: "center",
  }));

  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <Box display="flex" flexDirection={"row"} alignItems={"center"}>
          <img
            src="../src/assets/furcare-logo.png"
            height={"50"}
            width={"50"}
          />
          <Typography variant="h6" fontWeight={"bold"} align={"center"} pl={1}>
            Fur Care Veterinary Clinic
          </Typography>
        </Box>
        <Icons>
          <Badge badgeContent={4} color="primary">
            <Mail />
          </Badge>
          <Badge badgeContent={7} color="primary">
            <Notifications />
          </Badge>
          <Profile />
        </Icons>
      </StyledToolbar>
    </AppBar>
  );
}
