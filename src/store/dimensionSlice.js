import { createSlice } from "@reduxjs/toolkit";
import { initializeApp } from "firebase/app";

const initialState = { height: window.innerHeight, width: window.innerWidth };

const dimensionSlice = createSlice({
  name: "dimension",
  initialState: initialState,
  reducers: {
    changeDimention(state, action) {
      state.width = action.payload.width;
      state.height = action.payload.height;
    },
  },
});

export const dimensionActions = dimensionSlice.actions;
export default dimensionSlice.reducer;
