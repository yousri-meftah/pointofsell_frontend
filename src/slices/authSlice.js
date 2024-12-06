import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch }) => {
    const response = await api.post(
      "auth/login",
      new URLSearchParams({
        grant_type: "password",
        username: credentials.username,
        password: credentials.password,
        scope: "",
        client_id: "string",
        client_secret: "string",
      }).toString()
    );
    const token = response.data.access_token;
    localStorage.setItem("token", token);

    const userResponse = await api.get("auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(setCredentials({ user: userResponse.data, token }));
    return { user: userResponse.data, token };
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem("token", token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    });
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
