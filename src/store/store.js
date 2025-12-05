import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import busSlice from "./slices/busSlice";
import bookingSlice from "./slices/bookingSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    bus: busSlice,
    booking: bookingSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

