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

const CustomerModal = ({
  open,
  onClose,
  onSave,
  initialData = {},
  pricelists = [],
}) => {
  const [name, setName] = useState(initialData.name || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [pricelist, setPricelist] = useState(initialData.pricelist || "");
  console.log("data = ", initialData);
  useEffect(() => {
    setName(initialData.name || "");
    setEmail(initialData.email || "");
    setPricelist(initialData.pricelist || "");
  }, [initialData]);

  const handleSave = () => {
    onSave({ id: initialData.id, name, email, pricelist });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          {initialData.id ? "Edit Customer" : "Add Customer"}
        </Typography>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel>Pricelist</InputLabel>
          <Select
            value={pricelist}
            onChange={(e) => setPricelist(e.target.value)}
            label="Pricelist"
          >
            {pricelists.map((pl) => (
              <MenuItem key={pl.id} value={pl.id}>
                {pl.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

export default CustomerModal;
