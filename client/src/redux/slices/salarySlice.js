import { createSlice } from '@reduxjs/toolkit';

const salarySlice = createSlice({
  name: 'salary',
  initialState: { history: [] },
  reducers: {
    setSalaryHistory(state, action) {
      state.history = action.payload;
    },
  },
});

export const { setSalaryHistory } = salarySlice.actions;
export default salarySlice.reducer;
