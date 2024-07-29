import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const Receipt = ({ receiptData, onClose, handlePrint }) => {
  const {
    cart,
    totalPrice,
    totalDiscount,
    appliedPrograms,
    selectedPricelist,
    pricelists,
  } = receiptData;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100%"
      bgcolor="rgba(0, 0, 0, 0.5)"
      zIndex="1000"
    >
      <Paper
        elevation={3}
        sx={{ p: 2, width: "80%", maxWidth: "500px" }}
        className="receipt-paper"
      >
        <Typography variant="h6" gutterBottom align="center">
          Receipt
        </Typography>
        {selectedPricelist && (
          <Typography variant="body2" gutterBottom>
            Applied Pricelist: {pricelists[selectedPricelist - 1].name}
          </Typography>
        )}
        <List>
          {cart.map((item) => (
            <ListItem key={item.id} sx={{ py: 1, px: 2 }}>
              <ListItemText
                primary={item.name}
                secondary={`Qty: ${
                  item.quantity
                } Price: $${item.unit_price.toFixed(2)}`}
              />
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Typography variant="body2">Total:</Typography>
          <Typography variant="body2">${totalPrice.toFixed(2)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Typography variant="body2">Discounts:</Typography>
          <Typography variant="body2">-${totalDiscount.toFixed(2)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Typography variant="h6">Final Total:</Typography>
          <Typography variant="h6">
            ${(totalPrice - totalDiscount).toFixed(2)}
          </Typography>
        </Box>
        {appliedPrograms.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom mt={2}>
              Applied Discounts
            </Typography>
            <List>
              {appliedPrograms.map((program) => (
                <ListItem key={program.code} sx={{ py: 1, px: 2 }}>
                  <ListItemText
                    primary={program.code}
                    secondary={`-${program.discount.toFixed(2)}`}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handlePrint}
          className="no-print"
        >
          Print Receipt
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={onClose}
          className="no-print"
        >
          Close
        </Button>
      </Paper>
    </Box>
  );
};

export default Receipt;
