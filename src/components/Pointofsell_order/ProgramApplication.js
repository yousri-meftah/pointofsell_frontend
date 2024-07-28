import React, { useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";

const ProgramApplication = ({
  appliedProgram,
  onApplyCode,
  onRemoveProgram,
}) => {
  const [code, setCode] = useState("");

  const handleApplyCode = () => {
    onApplyCode(code);
    setCode("");
  };

  return (
    <>
      {appliedProgram && (
        <Box mb={2}>
          <Typography variant="body1">
            Applied Program: {appliedProgram.name}
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onRemoveProgram}
          >
            Remove
          </Button>
        </Box>
      )}
      <TextField
        label="Enter Code"
        variant="outlined"
        fullWidth
        margin="normal"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleApplyCode}
      >
        Apply
      </Button>
    </>
  );
};

export default ProgramApplication;
