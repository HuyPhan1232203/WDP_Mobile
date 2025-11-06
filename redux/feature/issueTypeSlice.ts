// redux/feature/issueTypeSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/axios";

// ============= ENUMS & TYPES =============

// Enum cho category
export enum IssueCategory {
  BATTERY = "battery",
  ENGINE = "engine",
  BRAKE = "brake",
  TIRE = "tire",
  ELECTRICAL = "electrical",
  SUSPENSION = "suspension",
  TRANSMISSION = "transmission",
  COOLING = "cooling",
  FUEL = "fuel",
  OTHER = "other",
}

// Enum cho severity
export enum IssueSeverity {
  MINOR = "minor",
  MODERATE = "moderate",
  MAJOR = "major",
  CRITICAL = "critical",
}

// ============= INTERFACES =============

interface CreateIssueTypeRequest {
  issue_name: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
}

interface UpdateIssueTypeRequest {
  issue_name?: string;
  description?: string;
  category?: IssueCategory;
  severity?: IssueSeverity;
}

interface IssueType {
  _id: string;
  issue_name: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface IssueTypeState {
  issueTypes: IssueType[];
  currentIssueType: IssueType | null;
  loading: boolean;
  error: string | null;
}

const initialState: IssueTypeState = {
  issueTypes: [],
  currentIssueType: null,
  loading: false,
  error: null,
};

// ============= ASYNC THUNKS =============

/**
 * GET /api/issue-types
 * Lấy danh sách issue types
 */
export const fetchAllIssueTypes = createAsyncThunk<IssueType[]>(
  "issueType/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<IssueType[]>("/issue-types");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch issue types"
      );
    }
  }
);

/**
 * GET /api/issue-types/{issueTypeId}
 * Lấy chi tiết một issue type
 */
export const fetchIssueTypeById = createAsyncThunk<IssueType, string>(
  "issueType/fetchById",
  async (issueTypeId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<IssueType>(`/issue-types/${issueTypeId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch issue type details"
      );
    }
  }
);

/**
 * POST /api/issue-types
 * Tạo issue type mới (Admin/Staff)
 */
export const createIssueType = createAsyncThunk<
  IssueType,
  CreateIssueTypeRequest
>(
  "issueType/create",
  async (issueTypeData: CreateIssueTypeRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<IssueType>("/issue-types", issueTypeData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create issue type"
      );
    }
  }
);

/**
 * PUT /api/issue-types/{issueTypeId}
 * Cập nhật issue type (Admin/Staff)
 */
export const updateIssueType = createAsyncThunk<
  IssueType,
  { issueTypeId: string; data: UpdateIssueTypeRequest }
>("issueType/update", async ({ issueTypeId, data }, { rejectWithValue }) => {
  try {
    const response = await api.put<IssueType>(
      `/issue-types/${issueTypeId}`,
      data
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update issue type"
    );
  }
});

/**
 * DELETE /api/issue-types/{issueTypeId}
 * Xóa issue type (Admin)
 */
export const deleteIssueType = createAsyncThunk<string, string>(
  "issueType/delete",
  async (issueTypeId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/issue-types/${issueTypeId}`);
      return issueTypeId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete issue type"
      );
    }
  }
);

// ============= SLICE =============

const issueTypeSlice = createSlice({
  name: "issueType",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentIssueType: (state) => {
      state.currentIssueType = null;
    },
    clearIssueTypes: (state) => {
      state.issueTypes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Issue Types
      .addCase(fetchAllIssueTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllIssueTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.issueTypes = action.payload.data.items;
      })
      .addCase(fetchAllIssueTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Issue Type By ID
      .addCase(fetchIssueTypeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIssueTypeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentIssueType = action.payload;
      })
      .addCase(fetchIssueTypeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Issue Type
      .addCase(createIssueType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIssueType.fulfilled, (state, action) => {
        state.loading = false;
        state.issueTypes.unshift(action.payload);
      })
      .addCase(createIssueType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Issue Type
      .addCase(updateIssueType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIssueType.fulfilled, (state, action) => {
        state.loading = false;

        // Update in issueTypes array
        const index = state.issueTypes.findIndex(
          (it) => it._id === action.payload._id
        );
        if (index !== -1) {
          state.issueTypes[index] = action.payload;
        }

        // Update currentIssueType if it's the same
        if (state.currentIssueType?._id === action.payload._id) {
          state.currentIssueType = action.payload;
        }
      })
      .addCase(updateIssueType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Issue Type
      .addCase(deleteIssueType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIssueType.fulfilled, (state, action) => {
        state.loading = false;

        // Remove from issueTypes array
        state.issueTypes = state.issueTypes.filter(
          (it) => it._id !== action.payload
        );

        // Clear currentIssueType if it's the deleted one
        if (state.currentIssueType?._id === action.payload) {
          state.currentIssueType = null;
        }
      })
      .addCase(deleteIssueType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentIssueType, clearIssueTypes } =
  issueTypeSlice.actions;

export default issueTypeSlice.reducer;

// Export types
export type { CreateIssueTypeRequest, IssueType, UpdateIssueTypeRequest };
