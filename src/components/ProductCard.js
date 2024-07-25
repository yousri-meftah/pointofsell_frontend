import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <Card sx={{ width: "30%", m: 1 }}>
      <CardMedia
        component="img"
        height="140"
        image={product.image_link}
        alt={product.name}
        sx={{ objectFit: "cover", height: "200px", width: "100%" }}
      />
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>

        <Typography variant="h6">${product.unit_price}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
