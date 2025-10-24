import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/axios";

interface Service {
  _id: string;
  service_name: string;
  description: string;
  base_price: number;
  estimated_duration: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ServiceState {
  services: Service[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  loading: false,
  error: null,
};

export const fetchServices = createAsyncThunk(
  "service/fetchServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/service/get");
      return response.data.data as Service[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch services"
      );
    }
  }
);

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = serviceSlice.actions;
export default serviceSlice.reducer;
