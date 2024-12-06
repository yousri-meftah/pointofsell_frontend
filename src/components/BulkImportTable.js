import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const BulkImportTable = ({ data, canForceErrors, errors, onClose, onForceImport }) => {
  // Prepare table columns dynamically
  const columns = data.fields.map((field) => ({
    field: field,
    headerName: field.replace(/_/g, " ").toUpperCase(),
    flex: 1,
  }));

  // Prepare table rows
  const rows = data.data.map((row, index) => ({
    id: index + 1, // Unique ID for each row
    ...row,
  }));

  return (
    <Modal open={true} onClose={onClose}>
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
          Import Data Review
        </Typography>

        {/* Data Table */}
        <Box sx={{ height: 400, width: "100%", mb: 2 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </Box>

        {/* Errors */}
        {errors.length > 0 && (
          <Box mb={2}>
            <Typography variant="body1" color="error" gutterBottom>
              Critical Errors:
            </Typography>
            {errors.map((error, index) => (
              <Alert key={index} severity="error" sx={{ mb: 1 }}>
                {`Line ${error.line || "Unknown"}: ${error.error}`}
              </Alert>
            ))}
          </Box>
        )}

        {/* Non-Critical Errors */}
        {canForceErrors.length > 0 && (
          <Box mb={2}>
            <Typography variant="body1" color="warning" gutterBottom>
              Warnings (Optional to Fix):
            </Typography>
            {canForceErrors.map((warning, index) => (
              <Alert key={index} severity="warning" sx={{ mb: 1 }}>
                {warning}
              </Alert>
            ))}
          </Box>
        )}

        {/* Buttons */}
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="contained" color="error" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={errors.length > 0}
            onClick={onForceImport}
          >
            Force Import
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BulkImportTable;
