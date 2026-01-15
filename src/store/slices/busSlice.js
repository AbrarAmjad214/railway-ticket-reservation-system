import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { busAPI } from "../../services/api";

// Async thunks
export const searchBuses = createAsyncThunk(
  "bus/search",
  async (params, { rejectWithValue }) => {
    try {
      const response = await busAPI.searchBuses(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search Train"
      );
    }
  }
);

export const getBusById = createAsyncThunk(
  "bus/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await busAPI.getBusById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get bus details"
      );
    }
  }
);

export const getAvailableSeats = createAsyncThunk(
  "bus/getAvailableSeats",
  async ({ busId, date }, { rejectWithValue }) => {
    try {
      const response = await busAPI.getAvailableSeats(busId, date);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get available seats"
      );
    }
  }
);

export const getPopularRoutes = createAsyncThunk(
  "bus/getPopularRoutes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await busAPI.getPopularRoutes();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get popular routes"
      );
    }
  }
);

const initialState = {
  buses: [],
  selectedBus: null,
  availableSeats: [],
  popularRoutes: [],
  searchParams: null,
  loading: false,
  error: null,
};

const busSlice = createSlice({
  name: "bus",
  initialState,
  reducers: {
    setSearchParams: (state, action) => {
      state.searchParams = action.payload;
    },
    setSelectedBus: (state, action) => {
      state.selectedBus = action.payload;
    },
    clearBuses: (state) => {
      state.buses = [];
      state.selectedBus = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchBuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBuses.fulfilled, (state, action) => {
        state.loading = false;
        state.buses = action.payload;
      })
      .addCase(searchBuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Bus By ID
      .addCase(getBusById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBusById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBus = action.payload;
      })
      .addCase(getBusById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Available Seats
      .addCase(getAvailableSeats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAvailableSeats.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSeats = action.payload;
      })
      .addCase(getAvailableSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Popular Routes
      .addCase(getPopularRoutes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPopularRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.popularRoutes = action.payload;
      })
      .addCase(getPopularRoutes.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setSearchParams, setSelectedBus, clearBuses, clearError } =
  busSlice.actions;
export default busSlice.reducer;

