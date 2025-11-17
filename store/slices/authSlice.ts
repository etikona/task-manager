// store/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users: User[];
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  users: [{ id: 1, name: "Demo User", email: "demo@example.com" }],
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    loginFailure: (state) => {
      state.loading = false;
    },
    registerStart: (state) => {
      state.loading = true;
    },
    registerSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    registerFailure: (state) => {
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  setUser,
} = authSlice.actions;
export default authSlice.reducer;
