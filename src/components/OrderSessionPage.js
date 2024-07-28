import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Tab,
  Tabs,
  Typography,
  InputBase,
  Paper,
  Grid,
  Divider,
  IconButton,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import OrderSummary from "../components/OrderSummary";

const OrderSessionPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6); // Fixed page size
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProductsByCategory(selectedCategory);
    } else {
      fetchProducts();
    }
  }, [selectedCategory, page]);

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
        params: {
          page_number: page,
          page_size: pageSize,
        },
      });
      setProducts(response.data.products);
      setTotalPages(response.data.total_pages);
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
        params: {
          page_number: page,
          page_size: pageSize,
        },
      });
      setProducts(response.data.products);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Failed to fetch products by category", error);
    }
  };

  const updateStoreWithPricelist = (products) => {
    setProducts(products);
  };

  const updateCartWithPricelist = (pricelistProducts) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        const pricelistProduct = pricelistProducts.find(
          (product) => product.id === item.id
        );
        console.log("yousri is here ", pricelistProduct);
        return pricelistProduct.new_price
          ? {
              ...item,
              old_price: item.unit_price,
              unit_price: pricelistProduct.new_price,
            }
          : {
              ...item,
              unit_price: item.old_price ? item.old_price : item.unit_price,
              old_price: null,
            };
      })
    );
  };

  const handleCategoryChange = (event, newCategory) => {
    setSelectedCategory(newCategory);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.quantity) {
        setCart(
          cart.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item
          )
        );
      }
    } else {
      if (product.quantity > 0) {
        setCart([
          ...cart,
          { ...product, quantity: 1, maxQuantity: product.quantity },
        ]);
      }
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

  const handleExitSession = () => {
    navigate("/sessions");
  };

  return (
    <Box display="flex" flexDirection="column" p={2}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Order Session</Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleExitSession}
        >
          Exit Session
        </Button>
      </Box>
      <Divider />
      <Box display="flex" mt={2} mb={2}>
        <Box width="70%" pr={2}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Tabs
              value={selectedCategory}
              onChange={handleCategoryChange}
              aria-label="categories"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="All Products" value="" />
              {categories.map((category) => (
                <Tab
                  label={category.name}
                  value={category.id}
                  key={category.id}
                />
              ))}
            </Tabs>
            <Box
              display="flex"
              alignItems="center"
              mt={2}
              mb={2}
              component={Paper}
              elevation={1}
              p={1}
            >
              <IconButton>
                <SearchIcon />
              </IconButton>
              <InputBase
                placeholder="Search products"
                value={searchTerm}
                onChange={handleSearchChange}
                fullWidth
              />
            </Box>
          </Paper>
          <Grid container spacing={2}>
            {filteredProducts.map((product) => {
              const cartQuantity =
                cart.find((item) => item.id === product.id)?.quantity || 0;
              return (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <ProductCard
                    product={product}
                    onAddToCart={addToCart}
                    cartQuantity={cartQuantity}
                  />
                </Grid>
              );
            })}
          </Grid>
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </Box>
        <Box width="30%" pl={2}>
          <OrderSummary
            cart={cart}
            onRemoveFromCart={removeFromCart}
            updateCartWithPricelist={updateCartWithPricelist}
            updateStoreWithPricelist={updateStoreWithPricelist}
            onAddToCart={addToCart}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default OrderSessionPage;
