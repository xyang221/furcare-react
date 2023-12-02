import styled from "@emotion/styled";
import {
  Archive,
  Home,
  ListRounded,
  MedicalServices,
  MiscellaneousServices,
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
  Paper,
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

export default function Settings() {
  const [selectedIndex, setSelectedIndex] = useState(
    parseInt(localStorage.getItem("selectedIndex")) || 0
  );

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
    localStorage.setItem("selectedIndex", index);
  };

  return (
    <Paper
      flex={1}
      sx={{ backgroundColor: "white", display: { xs: "none", sm: "block" }, overflow:"auto" }}
      position="fixed"
      
    >
      <StyledList>
        <ListItem>
          <ListItemButton
            selected={selectedIndex === 1}
            onClick={() => handleListItemClick(1)}
            to="/admin/roles"
          >
            <ListItemText primary="Roles"></ListItemText>
            <ListItemIcon>
              <People />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            selected={selectedIndex === 2}
            onClick={() => handleListItemClick(2)}
            to="/admin/users"
          >
            <ListItemText primary="Users"></ListItemText>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            selected={selectedIndex === 5}
            onClick={() => handleListItemClick(5)}
            to="/admin/staffs"
          >
            <ListItemText primary="Staffs"></ListItemText>
            <ListItemIcon>
              <Person2 />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            selected={selectedIndex === 3}
            onClick={() => handleListItemClick(3)}
            to="/admin/pets/breeds"
          >
            <ListItemText primary="Breeds"></ListItemText>
            <ListItemIcon>
              <Pets />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            selected={selectedIndex === 8}
            onClick={() => handleListItemClick(8)}
            to="/admin/pets/species"
          >
            <ListItemText primary="Species"></ListItemText>
            <ListItemIcon>
              <Pets />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
     
      
      </StyledList>
    </Paper>
  );
}
