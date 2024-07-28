import React from "react";
import OrderSummary from "../OrderSummary";

const Cart = ({
  cart,
  onRemoveFromCart,
  updateCartWithPricelist,
  updateStoreWithPricelist,
}) => (
  <OrderSummary
    cart={cart}
    onRemoveFromCart={onRemoveFromCart}
    updateCartWithPricelist={updateCartWithPricelist}
    updateStoreWithPricelist={updateStoreWithPricelist}
  />
);

export default Cart;
