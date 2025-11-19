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

interface CheckInItem {
  appointment_id: string;
  initial_vehicle_condition: string;
}

export interface CheckList {
  _id: string;
  appointment_id: {
    _id: string;
    appoinment_date: string;
    status: string;
    technician_id: string;
  };
  issue_type_id: {
    _id: string;
    category: string;
    severity: string;
    createdAt: string;
    updatedAt: string;
  };
  issue_description: string;
  solution_applied: string;
  parts: {
    part_id: {
      _id: string;
      part_number: string;
      part_name: string;
      description: string;
      cost_price: number;
      unit_price: number;
      supplier: string;
      warranty_month: number;
    };
    quantity: number;
    _id: string;
  }[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CheckListsResponse {
  success: boolean;
  message: string;
  data: {
    items: CheckList[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      items_per_page: number;
      has_next_page: boolean;
      has_prev_page: boolean;
    };
  };
}

interface GetCheckListsParams {
  page?: number;
  limit?: number;
  appointment_id?: string;
  technician_id?: string;
}

interface CheckListState {
  checklists: CheckList[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  } | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  completing: boolean;
}

const initialState: CheckListState = {
  checklists: [],
  pagination: null,
  loading: false,
  error: null,
  success: false,
  completing: false,
};

export const createCheckIn = createAsyncThunk(
  "checklist/createCheckIn",
  async (checkinData: CheckInItem, { rejectWithValue }) => {
    try {
      const response = await api.post("/checklist/checkin", checkinData);
      console.log(response);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create checkin"
      );
    }
  }
);

export const createCheckList = createAsyncThunk(
  "checklist/createCheckList",
  async (checklistData: CheckListItem, { rejectWithValue }) => {
    try {
      const response = await api.post("/checklist", checklistData);
      console.log(response);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create checklist"
      );
    }
  }
);
export const completeCheckList = createAsyncThunk(
  "checklist/completeCheckList",
  async (checklistId: string, { rejectWithValue }) => {
    try {
      const response = await api.put(`/checklist/${checklistId}/complete`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to complete checklist"
      );
    }
  }
);
export const getCheckLists = createAsyncThunk(
  "checklist/getCheckLists",
  async (params: GetCheckListsParams, { rejectWithValue }) => {
    try {
      console.log(JSON.stringify(params));
      const queryParams = new URLSearchParams({
        page: (params.page || 1).toString(),
        limit: (params.limit || 10).toString(),
      });
      if (params.appointment_id) {
        queryParams.append("appointment_id", params.appointment_id);
      }

      if (params.technician_id) {
        queryParams.append("technicianId", params.technician_id);
      }

      const response = await api.get(`/checklist?${queryParams.toString()}`);

      // Handle case when response is array (no pagination wrapper)
      if (Array.isArray(response.data)) {
        return {
          success: true,
          message: "Success",
          data: {
            items: response.data,
            pagination: {
              current_page: 1,
              total_pages: 1,
              total_items: response.data.length,
              items_per_page: response.data.length,
              has_next_page: false,
              has_prev_page: false,
            },
          },
        };
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch checklists"
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
    clearChecklists: (state) => {
      state.checklists = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create checkin
      .addCase(createCheckIn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCheckIn.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createCheckIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      // Create checklist
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
      })
      // Get checklists
      .addCase(getCheckLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCheckLists.fulfilled, (state, action) => {
        state.loading = false;
        state.checklists = action.payload.data.items;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getCheckLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(completeCheckList.pending, (state) => {
        state.completing = true;
        state.error = null;
      })
      .addCase(completeCheckList.fulfilled, (state, action) => {
        state.completing = false;
        state.success = true;

        // Update the checklist in the list if it exists
        const updatedChecklist = action.payload.data;
        const index = state.checklists.findIndex(
          (item) => item._id === updatedChecklist._id
        );
        if (index !== -1) {
          state.checklists[index] = updatedChecklist;
        }
      })
      .addCase(completeCheckList.rejected, (state, action) => {
        state.completing = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetSuccess, clearChecklists } =
  checkListSlice.actions;
export default checkListSlice.reducer;