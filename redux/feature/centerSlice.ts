import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/axios";

interface WorkingHour {
  day_of_week: string;
  open_time: string;
  close_time: string;
  is_close: boolean;
}

interface User {
  _id: string;
  username: string;
  fullName: string;
  email: string;
}

interface Day {
  date: string;
  day_of_week: string;
  open_time: string | null;
  close_time: string | null;
  is_close: boolean;
  totalSlots: number;
  bookedSlots: number;
  remainingSlots: number;
  availableSlots: number;
}

interface Week {
  week_number: number;
  week_start: string;
  week_end: string;
  days: Day[];
}

export interface Center {
  _id: string;
  center_name: string;
  address: string;
  phone: string;
  email?: string;
  user_id?: User;
  is_active: boolean;
  slots: number;
  working_hours?: WorkingHour[];
  weeks?: Week[];
  createdAt: string;
  updatedAt: string;
  last_reset?: string;
  __v: number;
}

interface CenterState {
  centers: Center[];
  loading: boolean;
  error: string | null;
}
export const parseDayOfWeek = (day: string) => {
  const days = {
    Monday: "Thứ Hai",
    Tuesday: "Thứ Ba",
    Wednesday: "Thứ Tư",
    Thursday: "Thứ Năm",
    Friday: "Thứ Sáu",
    Saturday: "Thứ Bảy",
    Sunday: "Chủ Nhật",
  };
  return days[day] || day;
};
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

export const fetchCentersWithSchedule = createAsyncThunk(
  "center/fetchCentersWithSchedule",
  async (
    { start_date, end_date }: { start_date: string; end_date: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get("/service-center/get", {
        params: { start_date, end_date },
      });
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch centers with schedule"
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
        console.log(action.payload);
        state.centers = action.payload.data;
      })
      .addCase(fetchCenters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCentersWithSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCentersWithSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.centers = action.payload.data;
      })
      .addCase(fetchCentersWithSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = centerSlice.actions;
export default centerSlice.reducer;
