import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/axios";

interface Part {
  part_id: string;
  quantity: number;
}

interface CheckListItem {
  appointment_id: string;
  issue_type_id: string;
  issue_description: string;
  solution_applied: string;
  parts: Part[];
}

interface CheckListState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: CheckListState = {
  loading: false,
  error: null,
  success: false,
};

export const createCheckList = createAsyncThunk(
  "checklist/createCheckList",
  async (checklistData: CheckListItem, { rejectWithValue }) => {
    try {
      const response = await api.post("/checklist", checklistData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create checklist"
      );
    }
  }
);

const checkListSlice = createSlice({
  name: "checklist",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckList.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCheckList.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createCheckList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { clearError, resetSuccess } = checkListSlice.actions;
export default checkListSlice.reducer;
