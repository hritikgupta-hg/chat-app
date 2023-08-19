import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./authSlice";
import chatSliceReducer from "./chatSlice";
import dimensionSliceReducer from "./dimensionSlice";

const store = configureStore({
  reducer: {
    authentication: authSliceReducer,
    chat: chatSliceReducer,
    dimension: dimensionSliceReducer,
  },
});

export default store;
