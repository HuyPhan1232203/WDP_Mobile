import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/axios";

interface WorkingHour {
  day_of_week: string;
  open_time: string;
  close_time: string;
  is_close: boolean;
}

export interface Center {
  _id: string;
  center_name: string;
  address: string;
  phone: string;
  email: string;
  working_hours: WorkingHour[];
}

interface CenterState {
  centers: Center[];
  loading: boolean;
  error: string | null;
}

const initialState: CenterState = {
  centers: [],
  loading: false,
  error: null,
};

export const fetchCenters = createAsyncThunk(
  "center/fetchCenters",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/service-center/get");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch centers"
      );
    }
  }
);

const centerSlice = createSlice({
  name: "center",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCenters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCenters.fulfilled, (state, action) => {
        state.loading = false;
        state.centers = action.payload.data;
      })
      .addCase(fetchCenters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = centerSlice.actions;
export default centerSlice.reducer;
