import React, { useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { Clear, Search } from "@mui/icons-material";
import axiosClient from "../axios-client";
import { useNavigate } from "react-router-dom";

export const HomeSearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [petowners, setPetowners] = useState([]);
  const [pets, setPets] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const search = (query) => {
    if (query) {
      setMessage(null);
      setPetowners([]);
      setLoading(true);
      axiosClient
        .get(`/petowners-search/${query}`)
        .then(({ data }) => {
          setLoading(false);
          setPetowners(data.data);
        })
        .catch((error) => {
          const response = error.response;
          if (response && response.status === 404) {
            setMessage(response.data.message);
          }
          setLoading(false);
        });
    }
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    setQuery(event.target.value);
  };

  const handleClick = () => {
    search(query);
  };

  const handleClearClick = () => {
    setQuery("");
    setMessage(null);
    setPetowners([]);
    setLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      search(query);
    }
  };

  return (
    <div
      style={{
        alignItems: "center",
        height: "30%",
        // width: "80%",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <TextField
          placeholder="Search petowners, pets here..."
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          fullWidth
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {query && ( // Show clear icon only when query is not empty
                  <Clear
                    onClick={handleClearClick}
                    style={{ cursor: "pointer" }}
                  />
                )}
              </InputAdornment>
            ),
            sx: { backgroundColor: "white" },
          }}
        />
        <Button
          variant="contained"
          onClick={handleClick}
          sx={{ marginLeft: "10px" }}
        >
          Search
        </Button>
      </Box>
      {query && (
        <Box
          p={2}
          sx={{
            maxHeight: "120px",
            backgroundColor: "white",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          }}
          overflow="auto"
        >
          {loading && <span>searching...</span>}
          {petowners.map((item) => (
            <MenuItem
              key={item.id}
              value={item.id}
              onClick={() => navigate(`/admin/petowners/` + item.id + `/view`)}
            >
              {`${item.firstname} ${item.lastname}`}
            </MenuItem>
          ))}
          {message && <span>{message}</span>}
        </Box>
      )}
    </div>
  );
};
