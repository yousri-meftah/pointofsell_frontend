import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
} from "@mui/material";
import { Remove } from "@mui/icons-material";

const CartItems = ({ cart, onRemoveFromCart }) => (
  <>
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
  </>
);

export default CartItems;
