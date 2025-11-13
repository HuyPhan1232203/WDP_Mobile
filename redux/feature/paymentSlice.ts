import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/axios";

interface UpdatePaymentStatusRequest {
  order_code: number;
  status: "paid"
}

interface UpdatePaymentStatusResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    order_code: number;
    status: string;
    amount: number;
    payment_method: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface PaymentState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: PaymentState = {
  loading: false,
  error: null,
  success: false,
};

export const updatePaymentStatus = createAsyncThunk(
  "payment/updatePaymentStatus",
  async (paymentData: UpdatePaymentStatusRequest, { rejectWithValue }) => {
    try {
      const response = await api.put<UpdatePaymentStatusResponse>(
        "/payment/update-status",
        paymentData
      );
      console.log(response)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update payment status"
      );
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
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
      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePaymentStatus.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { clearError, resetSuccess } = paymentSlice.actions;
export default paymentSlice.reducer;

// Export types
export type { UpdatePaymentStatusRequest, UpdatePaymentStatusResponse };
