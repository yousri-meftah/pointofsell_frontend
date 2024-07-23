import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";

const ProductModal = ({ open, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 1,
        }}
      >
        <h2>{initialData.name ? "Edit Product" : "Add Product"}</h2>
        <TextField
          label="Name"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Price"
          name="unit_price"
          type="number"
          value={formData.unit_price || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={formData.quantity || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            onClick={onClose}
            color="secondary"
            variant="outlined"
            style={{ marginRight: "10px" }}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProductModal;
