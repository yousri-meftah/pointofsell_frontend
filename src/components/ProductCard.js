import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";

const ProductCard = ({ product, onAddToCart, cartQuantity }) => {
  const isSoldOut = cartQuantity >= product.quantity;
  return (
    <Card
      style={{
        opacity: product.quantity > 0 ? 1 : 0.5,
        position: "relative",
        backgroundColor: isSoldOut ? "#f8d7da" : "white",
      }}
    >
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
        {product.new_price && (
          <>
            <Typography variant="h6" color="text.primary">
              ${product.new_price.toFixed(2)}
            </Typography>
            <Typography
              variant="body2"
              color="error"
              style={{ textDecoration: "line-through" }}
            >
              ${product.unit_price.toFixed(2)}
            </Typography>
          </>
        )}
        {!product.new_price && (
          <>
            <Typography variant="h6" color="text.primary">
              ${product.unit_price.toFixed(2)}
            </Typography>
          </>
        )}
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onAddToCart(product)}
            disabled={isSoldOut}
          >
            {isSoldOut ? "Sold Out" : "Add to Cart"}
          </Button>
        </Box>
      </CardContent>
      {product.quantity <= 0 && (
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
      )}
    </Card>
  );
};

export default ProductCard;
