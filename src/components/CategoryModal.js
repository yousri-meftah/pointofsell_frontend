import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

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

const CategoryModal = ({ open, onClose, onSave, initialData = {} }) => {
  //console.log("d = ", initialData);
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [iconName, setIconName] = useState(initialData.icon_name || "");

  useEffect(() => {
    setName(initialData.name || "");
    setDescription(initialData.description || "");
    setIconName(initialData.icon_name || "");
  }, [initialData]);

  const handleSave = () => {
    onSave({ name, description, icon_name: iconName });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          {name ? "Edit Category" : "Add Category"}
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
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Icon Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={iconName}
          onChange={(e) => setIconName(e.target.value)}
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

export default CategoryModal;
