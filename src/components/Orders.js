import React, { useState, useEffect } from "react";
import Filter from "../components/Filter";
import OrderPaginatedTable from "../components/OrderPaginatedTable";
import api from "../services/api";
import {
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Box,
} from "@mui/material";
import OrderDetailsModal from "../components/OrderDetailsModal";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, filter]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          page: page,
          page_size: pageSize,
          filter: filter,
        },
      });
      setOrders(response.data.list);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await api.get(`/orders/orders/${orderId}/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrderDetails(response.data);
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch order details", error);
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

  const handleOpenModal = (orderId) => {
    fetchOrderDetails(orderId);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setOrderDetails(null);
  };

  const columns = [
    { field: "id", headerName: "Order Ref" },
    { field: "session_id", headerName: "Session ID" },
    {
      field: "created_on",
      headerName: "Date",
      format: (value) => new Date(value).toLocaleDateString(),
    },
    { field: "receipt_number", headerName: "Receipt Number" },
    { field: "employee_name", headerName: "Employee" },
    { field: "customer_name", headerName: "Customer" },
    { field: "total_price", headerName: "Total" },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <Filter onFilter={handleFilter} />
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
      <OrderPaginatedTable
        data={orders}
        columns={columns}
        onRowClick={handleOpenModal}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {orderDetails && (
        <OrderDetailsModal
          open={modalOpen}
          onClose={handleCloseModal}
          orderDetails={orderDetails}
        />
      )}
    </div>
  );
};

export default OrdersPage;
