import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../slices/authSlice";

import {
  Button,
  TextField,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login({ username, password })).unwrap();
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to log in:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Typography variant="h4" color="textPrimary">
            Login
          </Typography>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="mb-4">
              <TextField
                type="text"
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
              />
            </div>
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
          </CardContent>
          <CardActions>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  );
};

export default Login;
