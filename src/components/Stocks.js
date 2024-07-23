import React, { useState } from "react";
import { Tabs, Tab, Box, Button } from "@mui/material";
import Categories from "./Categories";
import Products from "./Products"; // Create this component similarly to Categories

const Stocks = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          fullWidth
          variant={tabIndex === 0 ? "contained" : "outlined"}
          onClick={() => setTabIndex(0)}
        >
          Categories
        </Button>
        <Button
          fullWidth
          variant={tabIndex === 1 ? "contained" : "outlined"}
          onClick={() => setTabIndex(1)}
        >
          Products
        </Button>
      </Box>
      <Box p={3}>
        {tabIndex === 0 && <Categories />}
        {tabIndex === 1 && <Products />}
      </Box>
    </Box>
  );
};

export default Stocks;
