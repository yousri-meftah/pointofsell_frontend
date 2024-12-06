import React, { useState, useEffect } from "react";
import {
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Snackbar,
  Alert
} from "@mui/material";
import PaginatedTable from "../components/PaginatedTable";
import CategoryModal from "../components/CategoryModal";
import ConfirmModal from "../components/ConfirmModal";
import api from "../services/api";
import Filter from "./Filter";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Snackbar states
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchCategories();
  }, [page, pageSize, filter]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories", {});
      setCategories(response.data.categories);
      setTotalPages(Math.ceil(response.data.categories.length / pageSize));
    } catch (error) {
      console.error("Failed to fetch categories", error);
      showSnackbar("Failed to fetch categories", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
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
    const category = categories.find((c) => c.id === id);
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleDelete = (name) => {
    setSelectedCategory({ name });
    setConfirmOpen(true);
  };

  const handleSaveCategory = async (category) => {
    try {
      if (selectedCategory && selectedCategory.id) {
        // Update existing category
        await api.patch(`/categories/${selectedCategory.id}`, category, {});
        showSnackbar("Category updated successfully!");
      } else {
        // Add new category
        await api.post("/categories", category, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        showSnackbar("Category added successfully!");
      }
      setModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error(selectedCategory?.id ? "Failed to update category" : "Failed to add category", error);
      showSnackbar(
        selectedCategory?.id 
          ? "Failed to update category" 
          : "Failed to add category", 
        "error"
      );
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/categories/${selectedCategory.name}`, {});
      showSnackbar("Category deleted successfully!");
      setConfirmOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category", error);
      showSnackbar("Failed to delete category", "error");
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name" },
    { field: "description", headerName: "Description" },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <div>
          <Button
            variant="contained"
            color="primary"
            className="mr-2"
            onClick={() => {
              setSelectedCategory(null);
              setModalOpen(true);
            }}
          >
            Add Category
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
        data={categories}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <CategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCategory}
        initialData={selectedCategory || {}}
      />
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this category?"
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Categories;