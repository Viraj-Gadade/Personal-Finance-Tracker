import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js"; // Ensure the extension matches your file

const store = configureStore({
  reducer: {
    auth: authReducer,
    // add other reducers here
  },
});

export default store;