import React, { useState } from "react";
import { Tabs, Tab, Box, Grid, Button } from "@mui/material";
import Pricelists from "./Pricelists";
import Programs from "./Programs"; // Create this component similarly to Pricelists

const DiscountLoyalty = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant={tabIndex === 0 ? "contained" : "outlined"}
            onClick={() => setTabIndex(0)}
          >
            Pricelists
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant={tabIndex === 1 ? "contained" : "outlined"}
            onClick={() => setTabIndex(1)}
          >
            Program
          </Button>
        </Grid>
      </Grid>
      <Box p={3}>
        {tabIndex === 0 && <Pricelists />}
        {tabIndex === 1 && <Programs />}
      </Box>
    </Box>
  );
};

export default DiscountLoyalty;
