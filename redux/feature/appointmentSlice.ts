// appointmentSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/axios";

interface CreateAppointmentRequest {
  appoinment_date: string;
  appoinment_time: string;
  notes: string;
  user_id: string;
  vehicle_id: string;
  center_id: string;
  service_type_id: string;
  technician_id: string;
}

interface GetMyAppointmentsRequest {
  page: number;
  limit: number;
  status?: string;
  date_from?: string;
  date_to?: string;
  is_working_now?: boolean;
}

// Nested object interfaces
interface User {
  _id: string;
  username: string;
  fullName: string;
  email: string;
}

interface Vehicle {
  _id: string;
  license_plate: string;
  color: string;
}

interface Center {
  _id: string;
  address: string;
  phone: string;
}

interface ServiceType {
  _id: string;
  service_name: string;
  description: string;
  base_price: number;
  estimated_duration: string;
}

interface Payment {
  _id: string;
  orderCode: number;
  amount: number;
  status: string;
  checkoutUrl: string;
  qrCode: string;
}

// Main Appointment interface with nested objects
interface Appointment {
  _id: string;
  appoinment_date: string;
  appoinment_time: string;
  status: string;
  notes: string;
  estimated_cost: number;
  user_id: User;
  vehicle_id: Vehicle;
  center_id: Center;
  service_type_id: ServiceType;
  technician_id: {
    _id: string;
    fullName: string;
    email: string;
    role: string;
  };
  payment_id?: Payment;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// API Response interface
interface MyAppointmentsResponse {
  items: Appointment[];
  pagination: {
    current_page: number;
    items_per_page: number;
    total_items: number;
    total_pages: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

interface AppointmentState {
  appointments: Appointment[];
  currentAppointment: Appointment | null;
  myAppointments: Appointment[];
  pagination: MyAppointmentsResponse["pagination"] | null;
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  currentAppointment: null,
  appointments: [],
  myAppointments: [],
  pagination: null,
  loading: false,
  error: null,
};

export const createAppointment = createAsyncThunk(
  "appointment/createAppointment",
  async (appointmentData: CreateAppointmentRequest, { rejectWithValue }) => {
    try {
      console.log("object");
      const response = await api.post("/appointment/create", appointmentData);
      console.log(response);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create appointment"
      );
    }
  }
);

export const getMyAppointments = createAsyncThunk<
  MyAppointmentsResponse,
  GetMyAppointmentsRequest
>(
  "appointment/getMyAppointments",
  async (params: GetMyAppointmentsRequest, { rejectWithValue }) => {
    try {
      const { page, limit, status } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
      });

      const response = await api.get<MyAppointmentsResponse>(
        `/appointment/myAppointment?${queryParams.toString()}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch appointments"
      );
    }
  }
);

export const cancelAppointment = createAsyncThunk<Appointment, string>(
  "appointment/cancelAppointment",
  async (appointmentId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<Appointment>(
        `/appointment/${appointmentId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel appointment"
      );
    }
  }
);
export const getAppointmentById = createAsyncThunk<Appointment, string>(
  "appointment/getAppointmentById",
  async (appointmentId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<Appointment>(
        `/appointment/${appointmentId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch appointment details"
      );
    }
  }
);
const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMyAppointments: (state) => {
      state.myAppointments = [];
      state.pagination = null;
    },
    clearCurrentAppointment: (state) => {
      state.currentAppointment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get My Appointments
      .addCase(getMyAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyAppointments.fulfilled, (state, action) => {
        state.loading = false;
        // API trả về items và pagination
        state.myAppointments = action.payload.data.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(getMyAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppointmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAppointment = action.payload.data;
      })
      .addCase(getAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearMyAppointments, clearCurrentAppointment } =
  appointmentSlice.actions;
export default appointmentSlice.reducer;
// Export types
export type { Appointment, Center, Payment, ServiceType, User, Vehicle };
