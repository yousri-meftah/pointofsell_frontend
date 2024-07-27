import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Remove } from "@mui/icons-material";
import api from "../services/api";

const OrderSummary = ({ cart, onRemoveFromCart, updateCartWithPricelist }) => {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customers, setCustomers] = useState([]);
  const [code, setCode] = useState("");
  const [appliedProgram, setAppliedProgram] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/customers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCustomers(response.data.list);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    }
  };

  const handleCustomerChange = async (event) => {
    const customerId = event.target.value;
    setSelectedCustomer(customerId);

    try {
      const response = await api.get(`/pricelists/customer/${customerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.pricelist) {
        updateCartWithPricelist(response.data.pricelist);
      }
    } catch (error) {
      console.error("Failed to fetch pricelist", error);
    }
  };

  const handleApplyCode = async () => {
    try {
      const response = await api.post(
        "/apply-code",
        { code },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAppliedProgram(response.data);
      if (response.data.type === "pricelist") {
        updateCartWithPricelist(response.data.pricelist);
      } else if (response.data.type === "coupon") {
        // Apply coupon logic
      } else if (response.data.type === "buyXgetY") {
        // Apply BuyXGetY logic
      }
    } catch (error) {
      console.error("Failed to apply code", error);
    }
  };

  const handleRemoveProgram = () => {
    setAppliedProgram(null);
    // Logic to remove applied program effects
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.unit_price * item.quantity,
    0
  );

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      <Divider />
      {appliedProgram && (
        <Box mb={2}>
          <Typography variant="body1">
            Applied Program: {appliedProgram.name}
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleRemoveProgram}
          >
            Remove
          </Button>
        </Box>
      )}
      <List>
        {cart.map((item) => (
          <ListItem key={item.id} sx={{ py: 1, px: 2 }}>
            <ListItemText
              primary={`${item.name} x ${item.quantity}`}
              secondary={`$${item.unit_price.toFixed(2)} / Unit`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => onRemoveFromCart(item)}>
                <Remove />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <Typography variant="h6">Total:</Typography>
        <Typography variant="h6">${totalPrice.toFixed(2)}</Typography>
      </Box>
      <FormControl fullWidth margin="normal">
        <InputLabel>Customer</InputLabel>
        <Select value={selectedCustomer} onChange={handleCustomerChange}>
          {customers.map((customer) => (
            <MenuItem key={customer.id} value={customer.id}>
              {customer.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Enter Code"
        variant="outlined"
        fullWidth
        margin="normal"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleApplyCode}
      >
        Apply
      </Button>
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Pay
      </Button>
    </Paper>
  );
};

export default OrderSummary;
