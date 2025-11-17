import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users: User[];
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  users: [{ id: 1, name: "Demo User", email: "demo@example.com" }],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; name?: string }>) => {
      const { email, name } = action.payload;
      let user = state.users.find((u) => u.email === email);

      if (!user && name) {
        user = {
          id: Date.now(),
          name,
          email,
        };
        state.users.push(user);
      }

      if (user) {
        state.user = user;
        state.isAuthenticated = true;
      }
    },
    register: (
      state,
      action: PayloadAction<{ name: string; email: string }>
    ) => {
      const { name, email } = action.payload;
      const existingUser = state.users.find((u) => u.email === email);

      if (!existingUser) {
        const newUser: User = {
          id: Date.now(),
          name,
          email,
        };
        state.users.push(newUser);
        state.user = newUser;
        state.isAuthenticated = true;
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, register, logout } = authSlice.actions;
export default authSlice.reducer;
