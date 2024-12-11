import React, { useState, useEffect } from "react";
import Filter from "../components/Filter";
import PaginatedTable from "../components/PaginatedTable";
import UserModal from "../components/UserModal";
import ConfirmModal from "../components/ConfirmModal";
import api from "../services/api";
import BulkAddEmployeesModal from "./BulkAddEmployeesModal"
import {
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [importModalOpen, setImportModalOpen] = useState(false); // For Import Employees modal

  

  useEffect(() => {
    fetchEmployees();
  }, [page, pageSize, filter]);

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employee/get_all_employee", {
        params: {
          page_size: pageSize,
          page_number: page,
          filter: filter,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEmployees(response.data.list);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Failed to fetch employees", error);
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
    const employee = employees.find((e) => e.id === id);
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setSelectedEmployee({ id });
    setConfirmOpen(true);
  };

  const handleSaveEmployee = async (employee) => {
    console.log("employee", employee);
    if (employee && employee.id) {
      // Update employee
      try {
        await api.put(`/employee/${employee.id}`, employee, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (error) {
        console.error("Failed to update employee", error);
      }
    } else {
      // Add employee
      try {
        await api.post("/employee", employee, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (error) {
        console.error("Failed to add employee", error);
      }
    }
    //setModalOpen(false);
    fetchEmployees();
  };

  const handleConfirmDelete = async () => {
    /*try {
      await api.delete(`/employee/${selectedEmployee.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.error("Failed to delete employee", error);
    }
    setConfirmOpen(false);
    fetchEmployees();*/
  };

  const columns = [
    { field: "number", headerName: "Number" },
    {
      field: "firstname",
      headerName: "Name",
      valueGetter: (params) => `${params.row.firstname} ${params.row.lastname}`,
    },
    { field: "gender", headerName: "Gender" },
    { field: "phone_number", headerName: "Phone" },
    { field: "contract_type", headerName: "Contract Type" }, // Add job position if it's part of your schema
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
              setSelectedEmployee(null);
              setModalOpen(true);
            }}
          >
            Add Employee
          </Button>
          <Button
        variant="contained"
        color="secondary"
        onClick={() => setImportModalOpen(true)} // Open Import Employees modal
      >
        Import Employees
      </Button>
          {importModalOpen && (
        <BulkAddEmployeesModal
          open={importModalOpen}
          onClose={() => setImportModalOpen(false)} // Close the modal
        />
      )}
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
        data={employees}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEmployee}
        initialData={selectedEmployee || {}}
        isCustomer={false}
      />
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this employee?"
      />
    </div>
  );
};

export default Employees;
