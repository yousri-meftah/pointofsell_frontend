import React, { createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials, logout } from "../slices/authSlice";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          dispatch(setCredentials({ user: response.data, token }));
        })
        .catch(() => {
          localStorage.removeItem("token");
          dispatch(logout());
        });
    }
  }, [dispatch]);

  useEffect(() => {
    if (!token) {
      //navigate("/login");
    }
  }, [token, navigate]);

  return (
    <AuthContext.Provider value={{ token, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
