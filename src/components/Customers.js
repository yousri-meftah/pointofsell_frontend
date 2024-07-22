import React, { useState, useEffect } from "react";
import Filter from "../components/Filter";
import PaginatedTable from "../components/PaginatedTable";
import CustomerModal from "../components/CustomerModal";
import ConfirmModal from "../components/ConfirmModal";
import api from "../services/api";
import {
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [pricelists, setPricelists] = useState([]);

  useEffect(() => {
    fetchCustomers();
    fetchPricelists();
  }, [page, pageSize, filter]);

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/customers", {
        params: {
          page: page,
          page_size: pageSize,
          filter: filter,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCustomers(response.data.list);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    }
  };

  const fetchPricelists = async () => {
    try {
      const response = await api.get("/pricelists", {
        params: {
          page: 1,
          page_size: 100, // Assuming a high number to get all pricelists
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPricelists(
        response.data.items.map((item, index) => ({ id: index + 1, ...item }))
      );
    } catch (error) {
      console.error("Failed to fetch pricelists", error);
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
    const customer = customers.find((c) => c.id === id);
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setSelectedCustomer({ id });
    setConfirmOpen(true);
  };

  const handleSaveCustomer = async (customer) => {
    if (customer.id) {
      // Update customer
      try {
        await api.put(`/customers/${customer.id}`, customer, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (error) {
        console.error("Failed to update customer", error);
      }
    } else {
      // Add customer
      try {
        await api.post("/customers", customer, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (error) {
        console.error("Failed to add customer", error);
      }
    }
    setModalOpen(false);
    fetchCustomers();
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/customers/${selectedCustomer.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.error("Failed to delete customer", error);
    }
    setConfirmOpen(false);
    fetchCustomers();
  };

  const columns = [
    { field: "name", headerName: "Name" },
    { field: "email", headerName: "Email" },
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
              setSelectedCustomer(null);
              setModalOpen(true);
            }}
          >
            Add Customer
          </Button>
          <Button variant="contained" color="secondary">
            Import Customers
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
        data={customers}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <CustomerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCustomer}
        initialData={selectedCustomer || {}}
        pricelists={pricelists}
      />
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this customer?"
      />
    </div>
  );
};

export default Customers;
