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

export default function Sidebar() {
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
              <Home />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        {/* <ListItem>
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
        </ListItem> */}
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
        {/* <ListItem>
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
        </ListItem> */}
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
            selected={selectedIndex === 6}
            onClick={() => handleListItemClick(6)}
            to="/admin/appointments"
          >
            <ListItemText primary="Appointments"></ListItemText>
            <ListItemIcon>
              <ListRounded />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        {/* <ListItem>
          <ListItemButton
            selected={selectedIndex === 12}
            onClick={() => handleListItemClick(12)}
            to="/admin/deworminglogs"
          >
            <ListItemText primary="Deworming Logs"></ListItemText>
            <ListItemIcon>
              <ListRounded />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            selected={selectedIndex === 11}
            onClick={() => handleListItemClick(11)}
            to="/admin/vaccinationlogs"
          >
            <ListItemText primary="Vaccination Logs"></ListItemText>
            <ListItemIcon>
              <ListRounded />
            </ListItemIcon>
          </ListItemButton>
        </ListItem> */}
        {/* <ListItem>
          <ListItemButton
            selected={selectedIndex === 10}
            onClick={() => handleListItemClick(10)}
            to="/admin/diagnosis"
          >
            <ListItemText primary="Diagnosis"></ListItemText>
            <ListItemIcon>
              <ListRounded />
            </ListItemIcon>
          </ListItemButton>
        </ListItem> */}
        <ListItem>
          <ListItemButton
            selected={selectedIndex === 7}
            onClick={() => handleListItemClick(7)}
            to="/admin/services/petowners"
          >
            <ListItemText primary="Services"></ListItemText>
            <ListItemIcon>
              <MiscellaneousServices />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
      </StyledList>
    </Box>
    //  </Box>
  );
}
