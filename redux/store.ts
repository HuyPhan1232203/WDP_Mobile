import { configureStore } from "@reduxjs/toolkit";
import appointmentReducer from "./feature/appointmentSlice";
import centerReducer from "./feature/centerSlice";
import issueReportReducer from "./feature/issueReportSlice";
import issueTypeReducer from "./feature/issueTypeSlice";
import partReducer from "./feature/partSlice";
import serviceReducer from "./feature/serviceSlice";
import userReducer from "./feature/userSlice";
import vehicleReducer from "./feature/vehicleSlice";
export const store = configureStore({
  reducer: {
    vehicle: vehicleReducer,
    service: serviceReducer,
    user: userReducer,
    center: centerReducer,
    appointment: appointmentReducer,
    issueReport: issueReportReducer,
    part: partReducer,
    issueType: issueTypeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
