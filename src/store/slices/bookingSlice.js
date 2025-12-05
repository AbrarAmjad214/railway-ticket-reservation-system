import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { busBookingAPI } from "../../services/api";

// Async thunks
export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await busBookingAPI.createBooking(bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create booking"
      );
    }
  }
);

export const getUserBookings = createAsyncThunk(
  "booking/getUserBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await busBookingAPI.getUserBookings();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get bookings"
      );
    }
  }
);

export const getBookingById = createAsyncThunk(
  "booking/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await busBookingAPI.getBookingById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get booking"
      );
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "booking/cancel",
  async (id, { rejectWithValue }) => {
    try {
      const response = await busBookingAPI.cancelBooking(id);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel booking"
      );
    }
  }
);

const initialState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get User Bookings
      .addCase(getUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Booking By ID
      .addCase(getBookingById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })
      .addCase(getBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel Booking
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter(
          (booking) => booking.id !== action.payload.id
        );
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentBooking, clearCurrentBooking, clearError } =
  bookingSlice.actions;
export default bookingSlice.reducer;

