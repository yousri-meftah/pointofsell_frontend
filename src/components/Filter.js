import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

const Filter = ({ onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleFilter = () => {
    onFilter(searchTerm);
  };

  return (
    <div className="flex mb-4">
      <TextField
        label="Name"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleFilter}
        className="ml-2"
      >
        Filter
      </Button>
    </div>
  );
};

export default Filter;
