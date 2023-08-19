import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../firebase";

const initialState = { chatId: null, user: null };
const chatSlice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
    changeUser(state, action) {
      state.user = action.payload;
      state.chatId =
        auth.currentUser.uid > action.payload.uid
          ? auth.currentUser.uid + action.payload.uid
          : action.payload.uid + auth.currentUser.uid;
    },
  },
});

export default chatSlice.reducer;
export const chatActions = chatSlice.actions;
