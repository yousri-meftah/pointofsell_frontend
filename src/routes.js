import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Dashboard from "./components/Dashboard";
import Customers from "./components/Customers";
import Employees from "./components/Employees";
import Stocks from "./components/Stocks";
import Orders from "./components/Orders";
import Sessions from "./components/Sessions";
import DiscountLoyalty from "./components/DiscountLoyalty";
import NotFound from "./pages/NotFound";
import ForgetPassword from "./pages/ForgetPassword";
import ActivationResetPassword from "./pages/ActivationResetPassword";
import Login from "./pages/Login"; // Import Login component
import { useSelector } from "react-redux";
import OrderSessionPage from "./components/OrderSessionPage";

const AppRoutes = () => {
  const token = useSelector((state) => state.auth.token);

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      />
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route
          path="/reset-password/:token"
          element={<ActivationResetPassword isActivation={false} />}
        />
        <Route
          path="/activate/:token"
          element={<ActivationResetPassword isActivation={true} />}
        />
      </Route>
      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              "SUPER_USER",
              "ADMIN",
            ]}
          />
        }
      >
        <Route path="/dashboard" element={<Dashboard allowedRoles={["SUPER_USER", "ADMIN"]}  />} />
      </Route>
      
      <Route
        element={
          <ProtectedRoute allowedRoles={["SUPER_USER", "ADMIN", "VENDOR"]} />
        }
      >
        <Route path="/customers" element={<Customers />} />
      </Route>
      <Route
        element={<ProtectedRoute allowedRoles={["SUPER_USER", "ADMIN"]} />}
      >
        <Route path="/employees" element={<Employees />} />
      </Route>
      <Route
        element={
          <ProtectedRoute allowedRoles={["SUPER_USER", "INVENTORY_MANAGER"]} />
        }
      >
        <Route path="/stocks" element={<Stocks />} />
      </Route>
      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              "SUPER_USER",
              "ADMIN",
              "VENDOR",
              "INVENTORY_MANAGER",
            ]}
          />
        }
      >
        <Route path="/orders" element={<Orders />} />
      </Route>

      <Route
        element={<ProtectedRoute allowedRoles={["SUPER_USER", "VENDOR"]} />}
      >
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/sessions/:sessionId" element={<OrderSessionPage />} />
      </Route>

      <Route
        element={<ProtectedRoute allowedRoles={["SUPER_USER", "ADMIN"]} />}
      >
        <Route path="/discount-loyalty" element={<DiscountLoyalty />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
