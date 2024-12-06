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
  Checkbox,
  ListItemText,
} from "@mui/material";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350, // Reduced width
  maxHeight: "80vh", // Set max height to allow scrolling
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2, // Reduced padding
  overflowY: "auto", // Enable vertical scrolling
};

const contractTypes = ["CDI", "CDD"];
const rolesOptions = [
  "SUPER_USER",
  "ADMIN",
  "VENDOR",
  "INVENTORY_MANAGER",
];

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
  const [roles, setRoles] = useState(initialData.roles || []);
  const [number, setNumber] = useState(initialData.number || 0); // New field for 'number'
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
    setRoles(initialData.roles || []);
    setNumber(initialData.number || 0); // Initialize 'number' from initial data
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
          email,
          birthdate: birthDate,
          cnss_number: cnssNumber,
          gender,
          contract_type: contractType,
          roles: roles.map((role) => ({ name: role })),
          number, 
          status: isActive ? "ACTIVE" : "INACTIVE",
        };

    onSave(userData);
  };

  const handleRoleChange = (event) => {
    const {
      target: { value },
    } = event;
    setRoles(
      typeof value === "string" ? value.split(",") : value
    );
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
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <TextField
              label="Number"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number" // Added number field
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
            <FormControl variant="outlined" fullWidth margin="normal">
              <InputLabel>Roles</InputLabel>
              <Select
                multiple
                value={roles}
                onChange={handleRoleChange}
                renderValue={(selected) => selected.join(", ")}
              >
                {rolesOptions.map((role) => (
                  <MenuItem key={role} value={role}>
                    <Checkbox checked={roles.indexOf(role) > -1} />
                    <ListItemText primary={role} />
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
