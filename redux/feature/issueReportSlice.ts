// redux/feature/issueReportSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/axios";

// ============= INTERFACES =============

interface PartUsed {
  part_id: string;
  quantity: number;
  unit_cost: number;
}

interface CreateIssueReportRequest {
  appointment_id: string;
  issue_type_id: string;
  issue_description: string;
  solution_applied: string;
  parts_used: PartUsed[];
}

interface UpdateIssueReportRequest {
  appointment_id?: string;
  issue_type_id?: string;
  issue_description?: string;
  solution_applied?: string;
  parts_used?: PartUsed[];
}

// Response interfaces (nested objects từ API)
interface IssueType {
  _id: string;
  issue_name: string;
  description: string;
}

interface Part {
  _id: string;
  part_name: string;
  part_number: string;
  price: number;
}

interface PartUsedPopulated {
  part_id: Part;
  quantity: number;
  unit_cost: number;
  _id: string;
}

interface AppointmentInfo {
  _id: string;
  appoinment_date: string;
  appoinment_time: string;
  status: string;
}

interface IssueReport {
  _id: string;
  appointment_id: AppointmentInfo;
  issue_type_id: IssueType;
  issue_description: string;
  solution_applied: string;
  parts_used: PartUsedPopulated[];
  total_cost: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface IssueReportState {
  reports: IssueReport[];
  currentReport: IssueReport | null;
  appointmentReports: IssueReport[];
  loading: boolean;
  error: string | null;
}

const initialState: IssueReportState = {
  reports: [],
  currentReport: null,
  appointmentReports: [],
  loading: false,
  error: null,
};

// ============= ASYNC THUNKS =============

/**
 * GET /api/issue-reports
 * Lấy danh sách issue reports
 */
export const fetchAllIssueReports = createAsyncThunk<IssueReport[]>(
  "issueReport/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<IssueReport[]>("/issue-reports");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch issue reports"
      );
    }
  }
);

/**
 * GET /api/issue-reports/appointment/{appointment_id}
 * Lấy tất cả issue reports của một appointment
 */
export const fetchIssueReportsByAppointment = createAsyncThunk<
  IssueReport[],
  string
>(
  "issueReport/fetchByAppointment",
  async (appointmentId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<IssueReport[]>(
        `/issue-reports/appointment/${appointmentId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch appointment issue reports"
      );
    }
  }
);

/**
 * POST /api/issue-reports
 * Tạo issue report mới (Technician only)
 */
export const createIssueReport = createAsyncThunk<
  IssueReport,
  CreateIssueReportRequest
>(
  "issueReport/create",
  async (reportData: CreateIssueReportRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<IssueReport>(
        "/issue-reports",
        reportData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create issue report"
      );
    }
  }
);

/**
 * PUT /api/issue-reports/{reportId}
 * Cập nhật issue report
 */
export const updateIssueReport = createAsyncThunk<
  IssueReport,
  { reportId: string; data: UpdateIssueReportRequest }
>("issueReport/update", async ({ reportId, data }, { rejectWithValue }) => {
  try {
    const response = await api.put<IssueReport>(
      `/issue-reports/${reportId}`,
      data
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update issue report"
    );
  }
});

/**
 * DELETE /api/issue-reports/{reportId}
 * Xóa issue report
 */
export const deleteIssueReport = createAsyncThunk<string, string>(
  "issueReport/delete",
  async (reportId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/issue-reports/${reportId}`);
      return reportId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete issue report"
      );
    }
  }
);

// ============= SLICE =============

const issueReportSlice = createSlice({
  name: "issueReport",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
    clearAppointmentReports: (state) => {
      state.appointmentReports = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Issue Reports
      .addCase(fetchAllIssueReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllIssueReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.data;
      })
      .addCase(fetchAllIssueReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Issue Reports by Appointment
      .addCase(fetchIssueReportsByAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIssueReportsByAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointmentReports = action.payload;
      })
      .addCase(fetchIssueReportsByAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Issue Report
      .addCase(createIssueReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIssueReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.unshift(action.payload);
        state.appointmentReports.unshift(action.payload);
      })
      .addCase(createIssueReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Issue Report
      .addCase(updateIssueReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIssueReport.fulfilled, (state, action) => {
        state.loading = false;

        // Update in reports array
        const reportIndex = state.reports.findIndex(
          (r) => r._id === action.payload._id
        );
        if (reportIndex !== -1) {
          state.reports[reportIndex] = action.payload;
        }

        // Update in appointmentReports array
        const appointmentReportIndex = state.appointmentReports.findIndex(
          (r) => r._id === action.payload._id
        );
        if (appointmentReportIndex !== -1) {
          state.appointmentReports[appointmentReportIndex] = action.payload;
        }

        // Update currentReport if it's the same
        if (state.currentReport?._id === action.payload._id) {
          state.currentReport = action.payload;
        }
      })
      .addCase(updateIssueReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Issue Report
      .addCase(deleteIssueReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIssueReport.fulfilled, (state, action) => {
        state.loading = false;

        // Remove from reports array
        state.reports = state.reports.filter((r) => r._id !== action.payload);

        // Remove from appointmentReports array
        state.appointmentReports = state.appointmentReports.filter(
          (r) => r._id !== action.payload
        );

        // Clear currentReport if it's the deleted one
        if (state.currentReport?._id === action.payload) {
          state.currentReport = null;
        }
      })
      .addCase(deleteIssueReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentReport, clearAppointmentReports } =
  issueReportSlice.actions;

export default issueReportSlice.reducer;

// Export types
export type {
  AppointmentInfo,
  CreateIssueReportRequest,
  IssueReport,
  IssueType,
  Part,
  PartUsed,
  PartUsedPopulated,
  UpdateIssueReportRequest,
};
