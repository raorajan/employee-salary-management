import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './slices/employeeSlice';
import attendanceReducer from './slices/attendanceSlice';
import salaryReducer from './slices/salarySlice';
import advanceReducer from './slices/advanceSlice';
import authReducer from './slices/authSlice';

export default configureStore({
  reducer: {
    employees: employeeReducer,
    attendance: attendanceReducer,
    salary: salaryReducer,
    advance: advanceReducer,
    auth: authReducer,
  },
});
