import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Alert,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import api from "../services/api";


const BulkImportTable = ({ open, onClose }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null); // Store table data from the API
  const [canForceErrors, setCanForceErrors] = useState([]);
  const [criticalErrors, setCriticalErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [forceEnabled, setForceEnabled] = useState(false); // Enable force import button

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setData(null);
    setCanForceErrors([]);
    setCriticalErrors([]);
    setSuccessMessage("");
    setForceEnabled(false); // Reset force import state
  };

  const handleUpload = async (force = false) => {
    if (!file) {
      setCriticalErrors([{ error: "Please select a CSV file before uploading." }]);
      return;
    }

    setLoading(true);
    setCriticalErrors([]);
    setCanForceErrors([]);
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("file", file);
    //formData.append("force", force); // Pass force parameter to API

    try {
      const response = await api.post(
        "/customers/bulk_add?force="+force, // Replace with your API endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const fields  = ["email","name","pricelist_id"]
      const { status, data: tableData, can_force, errors, message } = response.data;

      if (status === "error") {
        setData({ fields, tableData }); // Set table data
        setCriticalErrors(errors || []);
        setForceEnabled(false); // Disable force import
      } else if (status === "can_force") {
        setData({ fields, tableData }); // Set table data
        setCanForceErrors(can_force || []);
        setForceEnabled(true); // Enable force import
      } else if (status === "imported") {
        setSuccessMessage(message);
        setTimeout(() => onClose(), 2000); // Close modal after 2 seconds
        window.location.reload();
      }
    } catch (error) {
      setCriticalErrors([{ error: "An error occurred while processing the file." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRowUpdate = (newRow, oldRow) => {
    try {
      // Update the data with the modified row
      const updatedRows = data.tableData.map((row, index) =>
        index === newRow.id - 1 ? { ...row, ...newRow } : row
      );
  
      setData((prevState) => ({
        ...prevState,
        tableData: updatedRows,
      }));
  
      return newRow; // Return the updated row
    } catch (error) {
      console.error("Error updating row:", error);
      throw error; // Re-throw the error to let the DataGrid handle it
    }
  };
  const handleRowUpdateError = (error) => {
    console.error("Row update error:", error);
  };
  

  const handleGenerateCSV = () => {
    console.log("data = ",data);
    debugger
    
    if (!data || !data.fields || !data.tableData) {
      console.error("Invalid data for generating CSV");
      return;
    }
  
    const csvRows = [
      data.fields.join(","), // Create CSV header
      ...data.tableData.map((row) =>
        data.fields.map((field) => row[field] || "").join(",") // Map updated rows
      ),
    ];
  
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "updated_customers.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
  };
  

  const columns = [
    { field: "email", headerName: "Email", flex: 1, editable: true },
    { field: "name", headerName: "Name", flex: 1, editable: true },
    { field: "pricelist_id", headerName: "Pricelist ID", flex: 1, editable: true },
  ];

  const rows = data?.tableData?.map((row, index) => ({
    id: index + 1, // Unique ID for each row
    ...row,
  })) || [];


  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "1200px",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" mb={2}>
          Bulk Add Customers
        </Typography>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ display: "block", marginBottom: "16px" }}
        />

        <Box display="flex" justifyContent="space-between" mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUpload(false)} // Normal import
            disabled={loading}
          >
            Import
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleUpload(true)} // Force import
            disabled={!forceEnabled || loading}
          >
            Force Import
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={handleGenerateCSV}
            disabled={!data}
          >
            Download Updated CSV
          </Button>
        </Box>

        {successMessage && (
          <Alert severity="success" sx={{ marginBottom: 2 }}>
            {successMessage}
          </Alert>
        )}
        {canForceErrors.length > 0 && (
          <Box mb={2}>
            <Typography variant="body1" color="orange" gutterBottom>
              Normal Errors:
            </Typography>
            {canForceErrors.map((error, index) => (
              <Alert key={index} severity="warning" sx={{ marginBottom: 1 }}>
                {`Line ${index || "Unknown"}: ${error}`}
              </Alert>
            ))}
          </Box>
        )}
        {criticalErrors.length > 0 && (
          <Box mb={2}>
            <Typography variant="body1" color="error" gutterBottom>
              Critical Errors:
            </Typography>
            {criticalErrors.map((error, index) => (
              <Alert key={index} severity="error" sx={{ marginBottom: 1 }}>
                {`Line ${error.line || "Unknown"}: ${error.error}`}
              </Alert>
            ))}
          </Box>
        )}

        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            processRowUpdate={handleProcessRowUpdate}
            onProcessRowUpdateError={handleRowUpdateError}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default BulkImportTable;
