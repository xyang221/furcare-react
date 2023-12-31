import styled from "@emotion/styled";
import {
  Archive,
  Home,
  ListAlt,
  People,
  Person,
  Person2,
  Pets,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";

const StyledList = styled(List)({
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
});

export default function PetOwnerSidebar() {
  const [selectedIndex, setSelectedIndex] = useState(
    parseInt(localStorage.getItem("selectedIndex")) || 0
  );

  // Update selectedIndex and store it in localStorage
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
        zIndex: 999,
      }}
      variant="permanent"
      anchor="left"
    >
      <StyledList>
        <ListItem>
          <ListItemButton
            selected={selectedIndex === 0}
            onClick={() => handleListItemClick(0)}
            to="/petowner"
          >
            <ListItemText primary="Home"></ListItemText>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            selected={selectedIndex === 2}
            onClick={() => handleListItemClick(2)}
            to="/petowner/appointments"
          >
            <ListItemText primary="Appointments"></ListItemText>
            <ListItemIcon>
              <ListAlt />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            selected={selectedIndex === 1}
            onClick={() => handleListItemClick(1)}
            to="/petowner/pets"
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
