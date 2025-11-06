import api from "@/config/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Appointment } from "./appointmentSlice";

// Interface cho params (nếu dùng TypeScript)
interface FetchScheduleParams {
  technician_id?: string;
  date_from: string; // YYYY-MM-DD
  date_to: string; // YYYY-MM-DD
  page?: number;
  limit?: number;
}

interface ScheduleState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  total: number;
}

// AsyncThunk để fetch lịch làm việc
export const fetchTechnicianSchedule = createAsyncThunk(
  "schedule/fetchTechnicianSchedule",
  async (params: FetchScheduleParams, { rejectWithValue }) => {
    try {
      console.log(JSON.stringify(params));
      const response = await api.get("appointment/technician-schedule", {
        params: {
          technician_id: params.technician_id,
          date_from: params.date_from,
          date_to: params.date_to,
          page: params.page || 1,
          limit: params.limit || 10,
        },
      });
      return response.data;
    } catch (error: any) {
      // Xử lý error và return reject
      return rejectWithValue(
        error.response?.data?.message || "Không thể tải lịch làm việc"
      );
    }
  }
);

// Initial state
const initialState: ScheduleState = {
  appointments: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  total: 0,
};

// Tạo slice
const technicianScheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    // Các reducer đồng bộ (nếu cần)
    clearSchedule: (state) => {
      state.appointments = [];
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Khi bắt đầu fetch (pending)
      .addCase(fetchTechnicianSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Khi fetch thành công (fulfilled)
      .addCase(fetchTechnicianSchedule.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.appointments = action.payload.data.schedules;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      // Khi fetch thất bại (rejected)
      .addCase(fetchTechnicianSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.appointments = [];
      });
  },
});

export const { clearSchedule, setCurrentPage } =
  technicianScheduleSlice.actions;
export default technicianScheduleSlice.reducer;
