import React, { useState, useEffect } from "react";
import {
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Box,
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

  useEffect(() => {
    fetchCategories();
  }, [page, pageSize, filter]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCategories(response.data.categories);
      setTotalPages(Math.ceil(response.data.categories.length / pageSize));
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
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
    console.log(id);
    const category = categories.find((c) => c.id === id);
    console.log("cat = ", category);
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleDelete = (name) => {
    setSelectedCategory({ name });
    setConfirmOpen(true);
  };

  const handleSaveCategory = async (category) => {
    if (selectedCategory && selectedCategory.name) {
      // Update category
      try {
        await api.put(`/categories/${selectedCategory.name}`, category, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (error) {
        console.error("Failed to update category", error);
      }
    } else {
      // Add category
      try {
        await api.post("/categories", category, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (error) {
        console.error("Failed to add category", error);
      }
    }
    setModalOpen(false);
    fetchCategories();
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/categories/${selectedCategory.name}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.error("Failed to delete category", error);
    }
    setConfirmOpen(false);
    fetchCategories();
  };

  const columns = [
    { field: "name", headerName: "Name" },
    { field: "description", headerName: "Description" },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <Filter onFilter={handleFilter} />
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
    </div>
  );
};

export default Categories;
