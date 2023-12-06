import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Typography } from "@mui/material";

export default function DropDownButtons(props) {
  const {
    title,
    optionLink1,
    optionLabel1,
    optionLink2,
    optionLabel2,
    optionLink3,
    optionLabel3,
  } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="button-menu"
        aria-haspopup="true"
        onClick={handleOpenMenu}
        endIcon={<ArrowDropDownIcon />}
      >
        <Typography variant="h5">{title}</Typography>
      </Button>
      <Menu
        id="button-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleCloseMenu} component="a" href={optionLink1}>
          {optionLabel1}
        </MenuItem>
        {optionLabel2 && (
          <MenuItem onClick={handleCloseMenu} component="a" href={optionLink2}>
            {optionLabel2}
          </MenuItem>
        )}
        {optionLabel3 && (
          <MenuItem onClick={handleCloseMenu} component="a" href={optionLink3}>
            {optionLabel3}
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}
