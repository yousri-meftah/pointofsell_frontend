import React, { useState } from "react";
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
const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("auth/forget_password", { email });
      alert("Password reset instructions have been sent to your email.");
    } catch (err) {
      console.error("Failed to send password reset instructions:", err);
      alert("Failed to send password reset instructions");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Typography variant="h4" color="textPrimary">
            Forget Password
          </Typography>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="mb-4">
              <TextField
                type="email"
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

export default ForgetPassword;
