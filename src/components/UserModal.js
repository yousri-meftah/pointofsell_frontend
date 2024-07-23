import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const UserModal = ({
  open,
  onClose,
  onSave,
  initialData = {},
  isCustomer = true,
  pricelists = [],
}) => {
  const [id, setId] = useState(initialData.id || null);
  const [name, setName] = useState(initialData.name || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [pricelist, setPricelist] = useState(initialData.pricelist || "");
  const [firstname, setFirstname] = useState(initialData.firstname || "");
  const [lastname, setLastname] = useState(initialData.lastname || "");
  const [number, setNumber] = useState(initialData.number || "");
  const [gender, setGender] = useState(initialData.gender || "");
  const [phoneNumber, setPhoneNumber] = useState(
    initialData.phone_number || ""
  );
  const [jobPosition, setJobPosition] = useState(
    initialData.job_position || ""
  );

  useEffect(() => {
    setId(initialData.id || null);
    setName(initialData.name || "");
    setEmail(initialData.email || "");
    setPricelist(initialData.pricelist || "");
    setFirstname(initialData.firstname || "");
    setLastname(initialData.lastname || "");
    setNumber(initialData.number || "");
    setGender(initialData.gender || "");
    setPhoneNumber(initialData.phone_number || "");
    setJobPosition(initialData.job_position || "");
  }, [initialData]);

  const handleSave = () => {
    if (isCustomer) {
      onSave({ id, name, email, pricelist });
    } else {
      onSave({
        id,
        firstname,
        lastname,
        number,
        gender,
        phone_number: phoneNumber,
        job_position: jobPosition,
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          {id
            ? isCustomer
              ? "Edit Customer"
              : "Edit Employee"
            : isCustomer
            ? "Add Customer"
            : "Add Employee"}
        </Typography>
        {isCustomer ? (
          <>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel>Pricelist</InputLabel>
              <Select
                value={pricelist}
                onChange={(e) => setPricelist(e.target.value)}
                label="Pricelist"
              >
                {pricelists.map((pl) => (
                  <MenuItem key={pl.id} value={pl.id}>
                    {pl.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        ) : (
          <>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            <TextField
              label="Number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
            <TextField
              label="Gender"
              variant="outlined"
              fullWidth
              margin="normal"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <TextField
              label="Job Position"
              variant="outlined"
              fullWidth
              margin="normal"
              value={jobPosition}
              onChange={(e) => setJobPosition(e.target.value)}
            />
          </>
        )}
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onClose}
          className="ml-2"
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default UserModal;
