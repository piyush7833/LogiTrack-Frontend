"use client";
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  isLoggedIn: false,
  role: null,
  token: null,
  name: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      console.log(action.payload);
      const { token, role, name } = action.payload;
      state.isLoggedIn = true;
      state.token = token;
      state.role = role;
      state.name = name;

      Cookies.set("token", token);
      Cookies.set("role", role);
      Cookies.set("name", name);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.role = null;
      state.token = null;
      state.name = null;
      state.user = null;

      Cookies.remove("token");
      Cookies.remove("role");
      Cookies.remove("name");
    },
    loadUserFromCookies: (state) => {
      const token = Cookies.get("token");
      const role = Cookies.get("role");
      const name = Cookies.get("name");

      if (token && role && name) {
        state.isLoggedIn = true;
        state.token = token;
        state.role = role;
        state.name = name;
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { loginSuccess, logout, loadUserFromCookies, setUser, updateUser } = authSlice.actions;
export default authSlice.reducer;
