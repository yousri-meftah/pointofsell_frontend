import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Box, Button, Tab, Tabs, Typography, InputBase } from "@mui/material";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import OrderSummary from "../components/OrderSummary";

const OrderSessionPage = () => {
  const { sessionId } = useParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProductsByCategory(selectedCategory);
    } else {
      fetchProducts();
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const fetchProductsByCategory = async (categoryId) => {
    try {
      const response = await api.get(`/products/category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error("Failed to fetch products by category", error);
    }
  };

  const handleCategoryChange = (event, newCategory) => {
    setSelectedCategory(newCategory);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                unit_price: product.unit_price,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        { ...product, quantity: 1, unit_price: product.unit_price },
      ]);
    }
  };

  const removeFromCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem.quantity === 1) {
      setCart(cart.filter((item) => item.id !== product.id));
    } else {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    }
  };

  const applyDiscount = (code) => {
    // Implement logic to apply discount
  };

  const applyCoupon = (code) => {
    // Implement logic to apply coupon
  };

  const applyBuyXGetY = () => {
    // Implement logic to apply BuyXGetY
  };
  const handleExitSession = () => {
    Navigate("/sessions");
  };
  return (
    <>
      <Box display="flex" justifyContent="space-between" p={2}>
        <Typography variant="h4">Order Session</Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleExitSession}
        >
          Exit Session
        </Button>
      </Box>

      <Box display="flex">
        <Box width="70%">
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            aria-label="categories"
            variant="scrollable"
            scrollButtons="auto"
          >
            {categories.map((category) => (
              <Tab
                label={category.name}
                value={category.id}
                key={category.id}
              />
            ))}
          </Tabs>
          <Box display="flex" alignItems="center" mt={2}>
            <InputBase
              placeholder="Search products"
              value={searchTerm}
              onChange={handleSearchChange}
              fullWidth
            />
          </Box>
          <Box display="flex" flexWrap="wrap" mt={2}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </Box>
        </Box>
        <Box width="30%" pl={2}>
          <OrderSummary
            cart={cart}
            onRemoveFromCart={removeFromCart}
            products={products}
            applyDiscount={applyDiscount}
            applyCoupon={applyCoupon}
            applyBuyXGetY={applyBuyXGetY}
          />
        </Box>
      </Box>
    </>
  );
};

export default OrderSessionPage;
