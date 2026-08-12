import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser, LoginResponse } from "./types";

const STORAGE_TOKEN_KEY = "dashboard_token";
const STORAGE_USER_KEY = "dashboard_user";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
}

function loadInitialState(): AuthState {
  const token = localStorage.getItem(STORAGE_TOKEN_KEY);
  const rawUser = localStorage.getItem(STORAGE_USER_KEY);
  return {
    token,
    user: rawUser ? (JSON.parse(rawUser) as AuthUser) : null,
  };
}

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    setCredentials: (state, action: PayloadAction<LoginResponse>) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      localStorage.setItem(STORAGE_TOKEN_KEY, action.payload.accessToken);
      localStorage.setItem(
        STORAGE_USER_KEY,
        JSON.stringify(action.payload.user),
      );
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
