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

export default function StaffSidebar() {
    const [selectedIndex, setSelectedIndex] = useState(
        parseInt(localStorage.getItem("selectedIndex")) || 0
      );
      
      // Update selectedIndex and store it in localStorage
      const handleListItemClick = (index) => {
        setSelectedIndex(index);
        localStorage.setItem("selectedIndex", index);
      };

  return (
    <Box
      flex={1}
      sx={{ backgroundColor: "white", display: { xs: "none", sm: "block" } }}
    >
      {/* <Box position="fixed"> */}
      <StyledList>
        <ListItem>
          <ListItemButton
            selected={selectedIndex === 0}
            onClick={() => handleListItemClick(0)}
            to="/"
          >
            <ListItemText primary="Dashboard"></ListItemText>
            <ListItemIcon>
              <Home/>
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            selected={selectedIndex === 1}
            onClick={() => handleListItemClick(1)}
            to="/pets"
          >
            <ListItemText primary="Pets"></ListItemText>
            <ListItemIcon>
              <Pets />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton  selected={selectedIndex === 2}
          onClick={() => handleListItemClick(2)}
        to="/appointments">
            <ListItemText primary="Appointments"></ListItemText>
            <ListItemIcon>
              <ListAlt />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
      </StyledList>
    </Box>
    // </Box>
  );
}
