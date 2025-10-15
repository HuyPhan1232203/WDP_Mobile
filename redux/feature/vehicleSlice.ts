import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/axios";
import { CreateVehicleRequest, Vehicle, VehicleModel } from "../types/vehicle";

interface VehicleState {
  models: VehicleModel[];
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
}

const initialState: VehicleState = {
  models: [],
  vehicles: [],
  loading: false,
  error: null,
};

export const fetchAllModels = createAsyncThunk(
  "vehicle/fetchAllModels",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/vehicle/get");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vehicle models"
      );
    }
  }
);

export const fetchUserVehicles = createAsyncThunk(
  "vehicle/fetchUserVehicles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/vehicle/getVehicleUser");
      console.log(response.data.data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user vehicles"
      );
    }
  }
);

export const createVehicle = createAsyncThunk(
  "vehicle/createVehicle",
  async (vehicleData: CreateVehicleRequest, { rejectWithValue }) => {
    try {
      const response = await api.post("/vehicle/createVehicle", vehicleData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create vehicle"
      );
    }
  }
);

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles.push(action.payload);
      })
      .addCase(createVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllModels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllModels.fulfilled, (state, action) => {
        state.loading = false;
        state.models = action.payload;
      })
      .addCase(fetchAllModels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload;
      })
      .addCase(fetchUserVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = vehicleSlice.actions;
export default vehicleSlice.reducer;
