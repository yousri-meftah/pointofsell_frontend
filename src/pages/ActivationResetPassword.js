import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  Button,
  TextField,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";

const ActivationResetPassword = ({ isActivation }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const url = isActivation ? "auth/activate" : "auth/reset-password";
      await api.post(url, {
        password,
        confirmPass: confirmPassword,
        code: token,
      });
      navigate("/login");
    } catch (err) {
      console.error("Failed to process request:", err);
      alert("Failed to process request");
    }
  };
  if (!token) {
    return <div>Invalid or missing token.</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Typography variant="h4" color="textPrimary">
            {isActivation ? "Activate Account" : "Reset Password"}
          </Typography>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="mb-4">
              <TextField
                type="password"
                label="Password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
            </div>
            <div className="mb-4">
              <TextField
                type="password"
                label="Confirm Password"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                fullWidth
              />
            </div>
          </CardContent>
          <CardActions>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};

export default ActivationResetPassword;
