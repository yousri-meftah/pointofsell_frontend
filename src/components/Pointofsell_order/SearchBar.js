import React from "react";
import { InputBase, Paper, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ searchTerm, onSearchChange }) => (
  <Paper
    elevation={1}
    sx={{ display: "flex", alignItems: "center", p: 1, mb: 2 }}
  >
    <IconButton>
      <SearchIcon />
    </IconButton>
    <InputBase
      placeholder="Search products"
      value={searchTerm}
      onChange={onSearchChange}
      fullWidth
    />
  </Paper>
);

export default SearchBar;
