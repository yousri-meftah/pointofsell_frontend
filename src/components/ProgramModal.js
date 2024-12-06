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

const ProgramModal = ({ open, onClose, onSave, initialData, products }) => {
  const [programType, setProgramType] = useState(
    initialData.program_type || "DISCOUNT"
  );
  const [programName, setProgramName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [startDate, setStartDate] = useState(initialData.start_date || "");
  const [endDate, setEndDate] = useState(initialData.end_date || "");
  const [discount, setDiscount] = useState(initialData.discount || "");
  const [buyItem, setBuyItem] = useState(initialData.buy_item || "");
  const [getItem, setGetItem] = useState(initialData.get_item || "");
  const [couponCount, setCouponCount] = useState(
    initialData.coupon_count || ""
  );

  useEffect(() => {
    if (initialData) {
      setProgramType(initialData.program_type || "DISCOUNT");
      setProgramName(initialData.name || "");
      setDescription(initialData.description || "");
      setStartDate(initialData.start_date || "");
      setEndDate(initialData.end_date || "");
      setDiscount(initialData.discount || "");
      setBuyItem(initialData.buy_item || "");
      setGetItem(initialData.get_item || "");
      setCouponCount(initialData.coupon_count || "");
    }
  }, [initialData]);

  const handleSave = () => {
    const programData = {
      program_type: programType,
      name: programName,
      description: description,
      start_date: startDate,
      end_date: endDate,
    };
    
    
    if (programType === "DISCOUNT") {
      programData.discount = discount;
      programData.coupon_count = couponCount;
    } else {
      programData.buy_item = buyItem;
      programData.get_item = getItem;
    }

    onSave(programData);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          {initialData.id ? "Edit Program" : "Add Program"}
        </Typography>
        <TextField
          label="Program Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={programName}
          onChange={(e) => setProgramName(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Program Type</InputLabel>
          <Select
            value={programType}
            onChange={(e) => setProgramType(e.target.value)}
          >
            <MenuItem value="DISCOUNT">Coupon</MenuItem>
            <MenuItem value="BUYXGETY">BuyXGetY</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Program Description"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
        {programType === "DISCOUNT" ? (
          <>
            <TextField
              label="Discount"
              variant="outlined"
              fullWidth
              margin="normal"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
            <TextField
              label="Coupon Count"
              variant="outlined"
              fullWidth
              margin="normal"
              value={couponCount}
              onChange={(e) => setCouponCount(e.target.value)}
            />
          </>
        ) : (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>Buy Item</InputLabel>
              <Select
                value={buyItem}
                onChange={(e) => setBuyItem(e.target.value)}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Get Item</InputLabel>
              <Select
                value={getItem}
                onChange={(e) => setGetItem(e.target.value)}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
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

export default ProgramModal;
