import React, { useState, useEffect } from "react";
import {
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import PaginatedTable from "../components/PaginatedTable";
import ProductModal from "../components/ProductModal";
import ConfirmModal from "../components/ConfirmModal";
import api from "../services/api";
import FilterProducts from "./FilterProducts";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Snackbar states
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchProducts();
  }, [page, pageSize, filter]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products", {
        params: {
          page: page,
          page_size: pageSize,
        },
      });
      setProducts(response.data.products);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Failed to fetch products", error);
      showSnackbar("Failed to fetch products", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleFilter = (searchTerm) => {
    setFilter(searchTerm);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const handleEdit = (id) => {
    const product = products.find((p) => p.id === id);
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = (name) => {
    setSelectedProduct({ name });
    setConfirmOpen(true);
  };

  const handleSaveProduct = async (product) => {
    try {
      if (selectedProduct && selectedProduct.id) {
        // Update product
        await api.patch(`/products/${selectedProduct.id}`, product, {});
        showSnackbar("Product updated successfully!");
      } else {
        // Add product
        await api.post("/products", product, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        showSnackbar("Product added successfully!");
      }
      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Failed to save product", error);
      showSnackbar(
        selectedProduct?.id ? "Failed to update product" : "Failed to add product",
        "error"
      );
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/products/${selectedProduct.name}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      showSnackbar("Product deleted successfully!");
      setConfirmOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product", error);
      showSnackbar("Failed to delete product", "error");
    }
  };

  const columns = [
    { field: "image_link", headerName: "Picture", image: true },
    { field: "name", headerName: "Name" },
    { field: "description", headerName: "Description" },
    { field: "unit_price", headerName: "Price" },
    { field: "quantity", headerName: "Quantity" },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between gap-10 mb-4">
        <FilterProducts onFilter={handleFilter} />
        <div>
          <Button
            variant="contained"
            color="primary"
            className="mr-2"
            onClick={() => {
              setSelectedProduct(null);
              setModalOpen(true);
            }}
          >
            Add Product
          </Button>
        </div>
      </div>
      <div className="flex justify-between mb-4">
        <FormControl variant="outlined" className="w-32">
          <InputLabel>Items per page</InputLabel>
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            label="Items per page"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </div>
      <PaginatedTable
        data={products}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProduct}
        initialData={selectedProduct || {}}
      />
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this product?"
      />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Products;
