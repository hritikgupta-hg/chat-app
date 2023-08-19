import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../firebase";

const initialState = { isLoggedIn: null };

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    updateUser: (state, action) => {
      if (action.payload) state.isLoggedIn = true;
      else state.isLoggedIn = false;
    },
  },
});

export default authSlice.reducer;
export const authActions = authSlice.actions;
