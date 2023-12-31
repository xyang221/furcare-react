import styled from "@emotion/styled";
import {
  Home,
  ListRounded,
  People,
  Pets,
} from "@mui/icons-material";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";

const StyledList = styled(List)(({ theme }) => ({
  // selected and (selected + hover) states
  "&& .Mui-selected, && .Mui-selected:hover": {
    backgroundColor: "black",
    "&, & .MuiListItemIcon-root": {
      color: "white",
    },
  },
  // hover states
  "& .MuiListItemButton-root:hover": {
    backgroundColor: "black",
    "&, & .MuiListItemIcon-root": {
      color: "white",
    },
  },
}));

export default function Sidebar() {
  const [selectedIndex, setSelectedIndex] = useState(
    parseInt(localStorage.getItem("selectedIndex")) || 0
  );

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
    localStorage.setItem("selectedIndex", index);
  };

  return (
    <Drawer
      sx={{
        width: "240px",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: "240px",
          boxSizing: "border-box",
          marginTop: "75px",
        },
        display: { xs: "none", sm: "block" },
      }}
      variant="permanent"
      anchor="left"
    >
      <StyledList>
        <ListItem>
          <ListItemButton
            selected={selectedIndex === 6}
            onClick={() => handleListItemClick(6)}
            to="/admin/home"
          >
            <ListItemText primary="Home"></ListItemText>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            selected={selectedIndex === 7}
            onClick={() => handleListItemClick(7)}
            to="/admin/appointments"
          >
            <ListItemText primary="Appointments"></ListItemText>
            <ListItemIcon>
              <ListRounded />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemButton
            selected={selectedIndex === 4}
            onClick={() => handleListItemClick(4)}
            to="/admin/petowners"
          >
            <ListItemText primary="Pet Owners"></ListItemText>
            <ListItemIcon>
              <People />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            selected={selectedIndex === 9}
            onClick={() => handleListItemClick(9)}
            to="/admin/pets"
          >
            <ListItemText primary="Pets"></ListItemText>
            <ListItemIcon>
              <Pets />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
      </StyledList>
    </Drawer>
  );
}
