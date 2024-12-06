import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

const FilterProducts = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minQuantity: "",
    maxQuantity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleFilter = () => {
    onFilter(filters);
  };

  return (
    <Box display="flex" gap={2} mb={2}>
      <TextField
        label="Name"
        name="name"
        value={filters.name}
        onChange={handleChange}
        variant="outlined"
      />
      <TextField
        label="Category"
        name="category"
        value={filters.category}
        onChange={handleChange}
        variant="outlined"
      />
      <TextField
        label="Min Price"
        name="minPrice"
        value={filters.minPrice}
        onChange={handleChange}
        variant="outlined"
      />
      <TextField
        label="Max Price"
        name="maxPrice"
        value={filters.maxPrice}
        onChange={handleChange}
        variant="outlined"
      />
      <TextField
        label="Min Quantity"
        name="minQuantity"
        value={filters.minQuantity}
        onChange={handleChange}
        variant="outlined"
      />
      <TextField
        label="Max Quantity"
        name="maxQuantity"
        value={filters.maxQuantity}
        onChange={handleChange}
        variant="outlined"
      />
      <Button variant="contained" onClick={handleFilter}>
        Filter
      </Button>
    </Box>
  );
};

export default FilterProducts;
