import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/authSlice";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import SessionIcon from "@mui/icons-material/Timer";

const Sidebar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!user) return null;

  const hasRole = (roles) => user.roles.some((role) => roles.includes(role));

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white flex flex-col">
      <div className="flex items-center justify-center h-16 bg-gray-900 text-xl font-bold">
        Point Of Sell
      </div>
      <List>
        {hasRole(["SUPER_USER", "ADMIN", "VENDOR", "INVENTORY_MANAGER"]) && (
          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon>
              <DashboardIcon className="text-white" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        )}
        {hasRole(["SUPER_USER", "ADMIN", "VENDOR"]) && (
          <ListItem button component={Link} to="/customers">
            <ListItemIcon>
              <PeopleIcon className="text-white" />
            </ListItemIcon>
            <ListItemText primary="Customers" />
          </ListItem>
        )}
        {hasRole(["SUPER_USER", "ADMIN"]) && (
          <ListItem button component={Link} to="/employees">
            <ListItemIcon>
              <PeopleIcon className="text-white" />
            </ListItemIcon>
            <ListItemText primary="Employees" />
          </ListItem>
        )}
        {hasRole(["SUPER_USER", "INVENTORY_MANAGER"]) && (
          <ListItem button component={Link} to="/stocks">
            <ListItemIcon>
              <InventoryIcon className="text-white" />
            </ListItemIcon>
            <ListItemText primary="Stocks" />
          </ListItem>
        )}
        {hasRole(["SUPER_USER", "ADMIN", "VENDOR", "INVENTORY_MANAGER"]) && (
          <ListItem button component={Link} to="/orders">
            <ListItemIcon>
              <ShoppingCartIcon className="text-white" />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>
        )}
        {hasRole(["SUPER_USER", "VENDOR"]) && (
          <ListItem button component={Link} to="/sessions">
            <ListItemIcon>
              <SessionIcon className="text-white" />
            </ListItemIcon>
            <ListItemText primary="Sessions" />
          </ListItem>
        )}
        {hasRole(["SUPER_USER", "ADMIN"]) && (
          <ListItem button component={Link} to="/discount-loyalty">
            <ListItemIcon>
              <LoyaltyIcon className="text-white" />
            </ListItemIcon>
            <ListItemText primary="Discount & Loyalty" />
          </ListItem>
        )}
      </List>
      <Divider />
      <div className="flex-grow" />
      <div className="p-4">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
