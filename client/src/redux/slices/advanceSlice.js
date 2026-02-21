import { createSlice } from '@reduxjs/toolkit';

const advanceSlice = createSlice({
  name: 'advance',
  initialState: { list: [] },
  reducers: {
    setAdvances(state, action) {
      state.list = action.payload;
    },
  },
});

export const { setAdvances } = advanceSlice.actions;
export default advanceSlice.reducer;
