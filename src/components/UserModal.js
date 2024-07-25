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
  Switch,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";

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

const contractTypes = ["CDI", "CDD", "Internship", "Freelance"];

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
  const [phoneNumber, setPhoneNumber] = useState(
    initialData.phone_number || ""
  );
  const [birthDate, setBirthDate] = useState(initialData.birth_date || "");
  const [cnssNumber, setCnssNumber] = useState(initialData.cnss_number || "");
  const [gender, setGender] = useState(initialData.gender || "");
  const [contractType, setContractType] = useState(
    initialData.contract_type || ""
  );
  const [isActive, setIsActive] = useState(
    initialData.account_status === "ACTIVE"
  );

  useEffect(() => {
    setId(initialData.id || null);
    setName(initialData.name || "");
    setEmail(initialData.email || "");
    setPricelist(initialData.pricelist || "");
    setFirstname(initialData.firstname || "");
    setLastname(initialData.lastname || "");
    setPhoneNumber(initialData.phone_number || "");
    setBirthDate(initialData.birth_date || "");
    setCnssNumber(initialData.cnss_number || "");
    setGender(initialData.gender || "");
    setContractType(initialData.contract_type || "");
    setIsActive(initialData.account_status === "ACTIVE");
  }, [initialData]);

  const handleSave = () => {
    const userData = isCustomer
      ? {
          id,
          name,
          email,
          pricelist,
          account_status: isActive ? "ACTIVE" : "INACTIVE",
        }
      : {
          id,
          firstname,
          lastname,
          phone_number: phoneNumber,
          birth_date: birthDate,
          cnss_number: cnssNumber,
          gender,
          contract_type: contractType,
          account_status: isActive ? "ACTIVE" : "INACTIVE",
        };

    onSave(userData);
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
              label="Phone Number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <TextField
              label="Birth Date"
              type="date"
              variant="outlined"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
            <TextField
              label="CNSS Number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={cnssNumber}
              onChange={(e) => setCnssNumber(e.target.value)}
            />
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel>Gender</InputLabel>
              <Select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                label="Gender"
              >
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel>Contract Type</InputLabel>
              <Select
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                label="Contract Type"
              >
                {contractTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              name="active"
              color="primary"
            />
          }
          label="Active"
        />
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            style={{ marginRight: "10px" }}
          >
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UserModal;
