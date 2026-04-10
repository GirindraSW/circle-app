import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = {
  user_id: string;
  username: string;
  name: string;
  email: string;
  avatar?: string | null;
};

// state utama
type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
};

const tokenFromStorage = localStorage.getItem("token");
const userFromStorage = localStorage.getItem("user");

const initialState: AuthState = {
  token: tokenFromStorage || null,
  user: userFromStorage ? (JSON.parse(userFromStorage) as AuthUser) : null,
  isAuthenticated: Boolean(tokenFromStorage),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ token: string; user: AuthUser }>,
    ) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
