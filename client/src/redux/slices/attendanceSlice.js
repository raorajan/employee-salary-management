import { createSlice } from '@reduxjs/toolkit';

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: { records: [] },
  reducers: {
    setAttendance(state, action) {
      state.records = action.payload;
    },
  },
});

export const { setAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;
