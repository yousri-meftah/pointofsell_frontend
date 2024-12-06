import React from "react";
import { Tabs, Tab, Paper } from "@mui/material";

const CategoryTabs = ({ categories, selectedCategory, onCategoryChange }) => (
  <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
    <Tabs
      value={selectedCategory}
      onChange={onCategoryChange}
      aria-label="categories"
      variant="scrollable"
      scrollButtons="auto"
    >
      <Tab label="All Products" value="" />
      {categories.map((category) => (
        <Tab label={category.name} value={category.id} key={category.id} />
      ))}
    </Tabs>
  </Paper>
);

export default CategoryTabs;
