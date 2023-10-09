import styled from "@emotion/styled";
import { AppBar, Autocomplete, Box, InputBase, TextField, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function Feed() {

  const Search = styled("div")(({ theme }) => ({
    backgroundColor: "black",
    padding: "5px 90px",
    borderRadius: theme.shape.borderRadius,
    width: "40%",
  }));
  
  return (
    <Box bgcolor=""  >
      {/* Feed */}
      <Search>
        <InputBase placeholder="search here..." />
      
      </Search>
    </Box>
  );
}
