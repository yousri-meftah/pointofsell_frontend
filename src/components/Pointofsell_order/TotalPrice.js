import React from "react";
import { Box, Typography } from "@mui/material";

const TotalPrice = ({ totalPrice }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
    <Typography variant="h6">Total:</Typography>
    <Typography variant="h6">${totalPrice.toFixed(2)}</Typography>
  </Box>
);

export default TotalPrice;
