import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

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

const ConfirmModal = ({ open, onClose, onConfirm, message }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Confirm
        </Typography>
        <Typography sx={{ mt: 2 }}>{message}</Typography>
        <Button variant="contained" color="primary" onClick={onConfirm}>
          Yes
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onClose}
          className="ml-2"
        >
          No
        </Button>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
