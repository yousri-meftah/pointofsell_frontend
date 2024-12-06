import React from "react";
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const OrderDetailsModal = ({ open, onClose, orderDetails }) => {
  return (
    <Modal open={open} onClose={onClose}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: { xs: "90%", md: "60%" }, // Responsive width
      maxHeight: "80vh", // Avoid overflow
      bgcolor: "background.paper",
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
      overflowY: "auto", // Allow scrolling if content overflows
    }}
  >
    <Typography variant="h5" gutterBottom>
      Order Details
    </Typography>
    <Divider sx={{ mb: 2 }} />
    <Box display="flex" justifyContent="space-between" mb={2}>
      <Typography variant="body1">
        <strong>Session ID:</strong> {orderDetails.session_id}
      </Typography>
      <Typography variant="body1">
        <strong>Customer ID:</strong> {orderDetails.customer_id}
      </Typography>
    </Box>
    <Box display="flex" justifyContent="space-between" mb={2}>
      <Typography variant="body1">
        <strong>Total Price:</strong> ${orderDetails.total_price.toFixed(2)}
      </Typography>
      <Typography variant="body1">
        <strong>Pricelist ID:</strong> {orderDetails.pricelist_id}
      </Typography>
    </Box>
    <Typography variant="body1" gutterBottom>
      <strong>Products:</strong>
    </Typography>
    <List>
      {orderDetails.products.map((product) => (
        <React.Fragment key={product.product_id}>
          <ListItem alignItems="flex-start">
            <ListItemText
              primary={`Product ID: ${product.product_id}`}
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                    display="block"
                  >
                    Unit Price: ${product.unit_price.toFixed(2)}
                  </Typography>
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                    display="block"
                  >
                    Quantity: {product.quantity}
                  </Typography>
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                    display="block"
                  >
                    Total Price: ${product.total_price.toFixed(2)}
                  </Typography>
                </>
              }
            />
          </ListItem>
          <Divider component="li" />
        </React.Fragment>
      ))}
    </List>
  </Box>
</Modal>

  );
};

export default OrderDetailsModal;
