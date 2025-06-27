import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user; // Assuming action.payload is {user: {...}} from your login action
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    setUser: (state, action) => {
      state.user = action.payload; // This will replace the entire user object in state
      state.isAuthenticated = true; // Ensure authentication status is true if a user is set
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;

export default authSlice.reducer;