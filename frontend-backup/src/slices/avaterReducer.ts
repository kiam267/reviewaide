import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  name : ""
}
const Avater = createSlice({
  name: "Avater",
  initialState,
  reducers: {
    avater: (state, action) => {
      state.name = action.payload;
    }
  }
})

export default Avater.reducer;
export const { avater } = Avater.actions;