import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
};
const Email = createSlice({
  name: 'Avater',
  initialState,
  reducers: {
    email: (state, action) => {
      state.email = action.payload;
    },
  },
});

export default Email.reducer;
export const { email } = Email.actions;
