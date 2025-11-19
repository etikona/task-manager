import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users: User[];
  loading: boolean;
  initialized: boolean;
}

const getInitialState = (): AuthState => {
  if (typeof window === "undefined") {
    return {
      user: null,
      isAuthenticated: false,
      users: [{ id: 1, name: "Demo User", email: "demo@example.com" }],
      loading: false,
      initialized: false,
    };
  }

  try {
    const savedState = localStorage.getItem("smart-task-manager-state");
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      return {
        ...parsedState.auth,
        loading: false,
        initialized: true,
      };
    }
  } catch (error) {
    console.error("Error loading auth state from localStorage:", error);
  }

  return {
    user: null,
    isAuthenticated: false,
    users: [{ id: 1, name: "Demo User", email: "demo@example.com" }],
    loading: false,
    initialized: false,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.initialized = true;
    },
    loginFailure: (state) => {
      state.loading = false;
      state.initialized = true;
    },
    registerStart: (state) => {
      state.loading = true;
    },
    registerSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.initialized = true;
    },
    registerFailure: (state) => {
      state.loading = false;
      state.initialized = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.initialized = true;
    },
    setInitialized: (state) => {
      state.initialized = true;
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
  setInitialized,
} = authSlice.actions;
export default authSlice.reducer;
