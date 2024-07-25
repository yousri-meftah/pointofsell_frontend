import React, { useState, useEffect } from "react";
import {
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import PaginatedTable from "../components/PaginatedTable";
import ConfirmModal from "../components/ConfirmModal";
import api from "../services/api";
import Filter from "./Filter";
import { Navigate } from "react-router-dom";

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, [page, pageSize, filter]);

  const fetchSessions = async () => {
    try {
      const response = await api.get("/sessions", {
        params: {
          page: page,
          page_size: pageSize,
          filter: filter,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSessions(response.data.list);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Failed to fetch sessions", error);
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

  const handleStartSession = async () => {
    Navigate(`/sessions/5`);
    return;
    try {
      const response = await api.post(
        "/sessions",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const newSessionId = response.data.session_id; // Adjust according to your response structure
      Navigate(`/sessions/${newSessionId}`);
    } catch (error) {
      console.error("Failed to start session", error);
    }
  };

  const handleEndSession = (id) => {
    setSelectedSession(id);
    setConfirmOpen(true);
  };

  const handleConfirmEndSession = async () => {
    try {
      // End session API call
      await api.post(
        `/sessions/end/${selectedSession}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchSessions();
    } catch (error) {
      console.error("Failed to end session", error);
    }
    setConfirmOpen(false);
  };

  const columns = [
    { field: "employee_id", headerName: "Employee ID" },
    {
      field: "opened_at",
      headerName: "Opened At",
      valueGetter: (params) => new Date(params.row.opened_at).toLocaleString(),
    },
    {
      field: "closed_at",
      headerName: "Closed At",
      valueGetter: (params) =>
        params.row.closed_at
          ? new Date(params.row.closed_at).toLocaleString()
          : "N/A",
    },
    { field: "session_status", headerName: "Status" },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <Filter onFilter={handleFilter} />
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleStartSession}
          >
            Start Session
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
        data={sessions}
        columns={columns}
        onEdit={handleEndSession}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmEndSession}
        message="Are you sure you want to end this session?"
      />
    </div>
  );
};

export default Sessions;
