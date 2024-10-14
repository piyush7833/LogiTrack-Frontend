"use client";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import vehicleReducer from "./vehicleSlice";
import driverReducer from "./driverSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    driver: driverReducer,
    vehicle: vehicleReducer,
  },
});
