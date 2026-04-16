import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import likeReducer from "../features/like/likeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    like: likeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
