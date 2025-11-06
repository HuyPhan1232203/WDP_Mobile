import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/axios";

interface User {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UserState {
  user: User | null;
  allUsers: User[];
  loading: boolean;
  loadingAll: boolean;
  error: string | null;
  totalUsers: number;
  currentPage: number;
  totalPages: number;
}

const initialState: UserState = {
  user: null,
  allUsers: [],
  loading: false,
  loadingAll: false,
  error: null,
  totalUsers: 0,
  currentPage: 1,
  totalPages: 1,
};

export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/getprofile");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user profile"
      );
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (
    { page, limit }: { page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get("/users/getallProfile", {
        params: { page, limit, role: "technician" },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all users"
      );
    }
  }
);
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loadingAll = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loadingAll = false;
        state.allUsers = action.payload.data.items;
        state.totalUsers = action.payload.data.pagination.total_items;
        state.currentPage = action.payload.data.pagination.current_page;
        state.totalPages = action.payload.data.pagination.total_pages;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loadingAll = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
