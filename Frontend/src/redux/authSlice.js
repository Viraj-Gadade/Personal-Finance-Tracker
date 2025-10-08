import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isSidebarOpen: false,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.loading = false;
    },
    setOpenSidebar(state, action) {
      state.isSidebarOpen = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isSidebarOpen = false;
      state.loading = false;
    },
  },
});

export const { setUser, setOpenSidebar, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
