import { configureStore } from "@reduxjs/toolkit";
import appointmentReducer from "./feature/appointmentSlice";
import centerReducer from "./feature/centerSlice";
import checkListReducer from "./feature/checkListSlice";
import issueReportReducer from "./feature/issueReportSlice";
import issueTypeReducer from "./feature/issueTypeSlice";
import partReducer from "./feature/partSlice";
import scheduleReducer from "./feature/scheduleSlice";
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
    schedule: scheduleReducer,
    checklist: checkListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
