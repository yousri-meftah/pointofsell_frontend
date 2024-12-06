import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ProductLineModal = ({
  open,
  onClose,
  onSave,
  pricelistId,
  products,
  initialData,
}) => {
  console.log("initialData", initialData);
  const [productId, setProductId] = useState(initialData.product_id || "");
  const [newPrice, setNewPrice] = useState(initialData.new_price || "");
  const [startDate, setStartDate] = useState(initialData.start_date || "");
  const [endDate, setEndDate] = useState(initialData.end_date || "");

  useEffect(() => {
    if (initialData.product_id) {
      setProductId(initialData.product_id);
      setNewPrice(initialData.new_price);
      setStartDate(initialData.start_date);
      setEndDate(initialData.end_date);
    }
  }, [initialData]);

  const handleSave = () => {
    onSave({
      pricelist_id: pricelistId,
      product_id: productId,
      new_price: newPrice,
      start_date: startDate,
      end_date: endDate,
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          {initialData.id ? "Edit Product Line" : "Add Product Line"}
        </Typography>
        {!initialData.id && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Product</InputLabel>
            <Select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <TextField
          label="New Price"
          variant="outlined"
          fullWidth
          margin="normal"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />
        <TextField
          label="Start Date"
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          label="End Date"
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onClose}
          className="ml-2"
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default ProductLineModal;
