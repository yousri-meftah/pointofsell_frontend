import React from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";

const ProductCardSoldOut = ({ product }) => (
  <Card style={{ opacity: 0.5, position: "relative" }}>
    <CardMedia
      component="img"
      height="140"
      image={product.image_link}
      alt={product.name}
    />
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {product.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {product.description}
      </Typography>
      <Typography variant="h6" color="text.primary">
        ${product.unit_price.toFixed(2)}
      </Typography>
    </CardContent>
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        bgcolor: "red",
        color: "white",
        padding: "0.5em",
        zIndex: 1,
      }}
    >
      Sold Out
    </Box>
  </Card>
);

export default ProductCardSoldOut;
