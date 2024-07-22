import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import AppRoutes from "./routes";

const AppContent = () => {
  const location = useLocation();
  const hideSidebarPaths = [
    "/forget-password",
    "/reset-password",
    "/activate",
    "/login",
  ];
  const hideSidebar = hideSidebarPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!hideSidebar && <Sidebar />}
      <div className={hideSidebar ? "w-full" : "ml-64"}>
        <AppRoutes />
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
