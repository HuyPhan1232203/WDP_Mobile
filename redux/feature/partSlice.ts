// redux/feature/partSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/axios";

// ============= INTERFACES =============

interface CreatePartRequest {
  part_number: string;
  part_name: string;
  description: string;
  cost_price: number;
  unit_price: number;
  supplier: string;
  warranty_month: number;
}

interface UpdatePartRequest {
  part_number?: string;
  part_name?: string;
  description?: string;
  cost_price?: number;
  unit_price?: number;
  supplier?: string;
  warranty_month?: number;
}

interface Part {
  _id: string;
  part_number: string;
  part_name: string;
  description: string;
  cost_price: number;
  unit_price: number;
  supplier: string;
  warranty_month: number;
  stock_quantity?: number; // Nếu API có trả về
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PartState {
  parts: Part[];
  currentPart: Part | null;
  loading: boolean;
  error: string | null;
}

const initialState: PartState = {
  parts: [],
  currentPart: null,
  loading: false,
  error: null,
};

// ============= ASYNC THUNKS =============

/**
 * GET /api/parts
 * Lấy danh sách parts
 */
export const fetchAllParts = createAsyncThunk<Part[]>(
  "part/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Part[]>("/parts");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch parts"
      );
    }
  }
);

/**
 * GET /api/parts/{partId}
 * Lấy chi tiết một part
 */
export const fetchPartById = createAsyncThunk<Part, string>(
  "part/fetchById",
  async (partId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<Part>(`/parts/${partId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch part details"
      );
    }
  }
);

/**
 * POST /api/parts
 * Tạo part mới
 */
export const createPart = createAsyncThunk<Part, CreatePartRequest>(
  "part/create",
  async (partData: CreatePartRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<Part>("/parts", partData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create part"
      );
    }
  }
);

/**
 * PUT /api/parts/{partId}
 * Cập nhật part
 */
export const updatePart = createAsyncThunk<
  Part,
  { partId: string; data: UpdatePartRequest }
>("part/update", async ({ partId, data }, { rejectWithValue }) => {
  try {
    const response = await api.put<Part>(`/parts/${partId}`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update part"
    );
  }
});

/**
 * DELETE /api/parts/{partId}
 * Xóa part
 */
export const deletePart = createAsyncThunk<string, string>(
  "part/delete",
  async (partId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/parts/${partId}`);
      return partId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete part"
      );
    }
  }
);

// ============= SLICE =============

const partSlice = createSlice({
  name: "part",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPart: (state) => {
      state.currentPart = null;
    },
    clearParts: (state) => {
      state.parts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Parts
      .addCase(fetchAllParts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllParts.fulfilled, (state, action) => {
        state.loading = false;
        state.parts = action.payload.data;
      })
      .addCase(fetchAllParts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Part By ID
      .addCase(fetchPartById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPart = action.payload;
      })
      .addCase(fetchPartById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Part
      .addCase(createPart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPart.fulfilled, (state, action) => {
        state.loading = false;
        state.parts.unshift(action.payload);
      })
      .addCase(createPart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Part
      .addCase(updatePart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePart.fulfilled, (state, action) => {
        state.loading = false;

        // Update in parts array
        const index = state.parts.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.parts[index] = action.payload;
        }

        // Update currentPart if it's the same
        if (state.currentPart?._id === action.payload._id) {
          state.currentPart = action.payload;
        }
      })
      .addCase(updatePart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Part
      .addCase(deletePart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePart.fulfilled, (state, action) => {
        state.loading = false;

        // Remove from parts array
        state.parts = state.parts.filter((p) => p._id !== action.payload);

        // Clear currentPart if it's the deleted one
        if (state.currentPart?._id === action.payload) {
          state.currentPart = null;
        }
      })
      .addCase(deletePart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentPart, clearParts } = partSlice.actions;

export default partSlice.reducer;

// Export types
export type { CreatePartRequest, Part, UpdatePartRequest };
