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
import { Remove, Add } from "@mui/icons-material";
import api from "../services/api";
import Receipt from "../components/Receipt";

const OrderSummary = ({
  cart,
  onRemoveFromCart,
  updateCartWithPricelist,
  updateStoreWithPricelist,
  onAddToCart,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedPricelist, setSelectedPricelist] = useState("");
  const [customers, setCustomers] = useState([]);
  const [pricelists, setPricelists] = useState([]);
  const [code, setCode] = useState("");
  const [appliedPrograms, setAppliedPrograms] = useState([]);
  const [discounts, setDiscounts] = useState({});
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    fetchCustomers();
    fetchPricelists();
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

  const fetchPricelists = async () => {
    try {
      const response = await api.get("/pricelists", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPricelists(response.data.items);
    } catch (error) {
      console.error("Failed to fetch pricelists", error);
    }
  };

  const handleCustomerChange = async (event) => {
    const customerId = event.target.value;
    setSelectedCustomer(customerId);
    if (customerId) {
      try {
        const response = await api.get(`/customers/${customerId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.pricelist_id) {
          const pricelistResponse = await api.get(
            `/products/pricelist/${response.data.pricelist_id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              params: {
                page: 1,
                page_size: 100,
              },
            }
          );
          updateStoreWithPricelist(pricelistResponse.data.products);
          updateCartWithPricelist(pricelistResponse.data.products);
          setSelectedPricelist(response.data.pricelist_id);
        } else {
          setSelectedPricelist("");
          resetPrices();
        }
      } catch (error) {
        console.error("Failed to fetch pricelist", error);
      }
    } else {
      resetPrices();
      setSelectedPricelist("");
    }
  };
  const handleReceipt = () => {
    const totalPrice = cart.reduce(
      (total, item) => total + item.unit_price * item.quantity,
      0
    );

    const totalDiscount = Object.values(discounts).reduce(
      (total, discount) => total + (discount || 0),
      0
    );

    const receiptData = {
      cart,
      totalPrice,
      totalDiscount,
      appliedPrograms,
      selectedPricelist,
      pricelists,
    };

    setReceiptData(receiptData);
    setShowReceipt(true);
  };

  const handlePricelistChange = async (event) => {
    const pricelistId = event.target.value;
    setSelectedPricelist(pricelistId);

    if (pricelistId) {
      try {
        const pricelistResponse = await api.get(
          `/products/pricelist/${pricelistId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              page: 1,
              page_size: 100,
            },
          }
        );
        updateStoreWithPricelist(pricelistResponse.data.products);
        updateCartWithPricelist(pricelistResponse.data.products);
      } catch (error) {
        console.error("Failed to fetch pricelist", error);
      }
    } else {
      resetPrices();
    }
  };

  const handleApplyCode = async () => {
    if (!code) {
      alert("Please enter a code.");
      return;
    }

    if (appliedPrograms.some((program) => program.code === code)) {
      alert("This code is already applied.");
      return;
    }
    const totalPrice = cart.reduce(
      (total, item) => total + item.unit_price * item.quantity,
      0
    );

    try {
      const response = await api.post(
        "/programs/calcule_program/",
        {
          code: [code],
          total: totalPrice,
          products: cart.map((item) => item.id),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response);

      const discountPrograms = response.data.results;

      if (discountPrograms[code].status === "Valid") {
        setAppliedPrograms((prev) => [
          ...prev,
          { code, discount: discountPrograms[code].discount },
        ]);
        setDiscounts((prev) => ({
          ...prev,
          [code]: discountPrograms[code].discount,
        }));
      } else {
        alert("The code is not valid.");
      }
    } catch (error) {
      console.error("Failed to apply program", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };

  const handleRemoveProgram = (programCode) => {
    setAppliedPrograms((prev) =>
      prev.filter((program) => program.code !== programCode)
    );
    setDiscounts((prev) => {
      const newDiscounts = { ...prev };
      delete newDiscounts[programCode];
      return newDiscounts;
    });
  };

  const resetPrices = async () => {
    try {
      const response = await api.get("/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          page_number: 1,
          page_size: 100,
        },
      });
      updateStoreWithPricelist(response.data.products);
      updateCartWithPricelist(response.data.products);
    } catch (error) {
      console.error("Failed to reset prices", error);
    }
  };

  const totalDiscount = Object.values(discounts).reduce(
    (total, discount) => total + (discount || 0),
    0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.unit_price * item.quantity,
    0
  );
  console.log("cddddart = ", receiptData);
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      <Divider />
      {appliedPrograms.length > 0 && (
        <Box mb={2}>
          {appliedPrograms.map((program) => (
            <Box
              key={program.code}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="body1">
                {program.code}: -${program.discount.toFixed(2)}
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleRemoveProgram(program.code)}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Box>
      )}
      <List>
        {cart.map((item) => (
          <ListItem key={item.id} sx={{ py: 1, px: 2 }}>
            <ListItemText
              primary={`${item.name} x ${item.quantity}`}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                  >
                    {`$${item.unit_price.toFixed(2)} / Unit`}
                  </Typography>
                  {item.old_price && item.old_price !== item.unit_price && (
                    <Typography
                      component="span"
                      variant="body2"
                      color="error"
                      style={{ textDecoration: "line-through", marginLeft: 10 }}
                    >
                      {`$${item.old_price.toFixed(2)}`}
                    </Typography>
                  )}
                </React.Fragment>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => onRemoveFromCart(item)}>
                <Remove />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => onAddToCart(item)}
                disabled={item.quantity >= item.maxQuantity}
              >
                <Add />
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
        <Typography variant="h6">
          Total:{" "}
          {appliedPrograms.length > 0 && (
            <span style={{ textDecoration: "line-through" }}>
              ${totalPrice.toFixed(2)}
            </span>
          )}
          {"      "}${(totalPrice - totalDiscount).toFixed(2)}
        </Typography>
      </Box>
      <FormControl fullWidth margin="normal">
        <InputLabel>Customer</InputLabel>
        <Select value={selectedCustomer} onChange={handleCustomerChange}>
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {customers.map((customer) => (
            <MenuItem key={customer.id} value={customer.id}>
              {customer.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Pricelist</InputLabel>
        <Select value={selectedPricelist} onChange={handlePricelistChange}>
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {pricelists.map((pricelist) => (
            <MenuItem key={pricelist.id} value={pricelist.id}>
              {pricelist.name}
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
      {showReceipt && (
        <Receipt
          receiptData={receiptData}
          onClose={() => setShowReceipt(false)}
        />
      )}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleReceipt}
      >
        Pay
      </Button>
    </Paper>
  );
};

export default OrderSummary;
