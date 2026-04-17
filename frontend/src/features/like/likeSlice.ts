import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type LikeStateItem = {
  liked: boolean;
  likeCount: number;
};

type LikeState = {
  byThreadId: Record<string, LikeStateItem>;
};

const initialState: LikeState = {
  byThreadId: {},
};

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    hydrateLikesFromThreads: (
      state,
      action: PayloadAction<Array<{ id: string; liked: boolean; likeCount: number }>>,
    ) => {
      action.payload.forEach((thread) => {
        state.byThreadId[thread.id] = {
          liked: thread.liked,
          likeCount: thread.likeCount,
        };
      });
    },
    setThreadLikeState: (
      state,
      action: PayloadAction<{ threadId: string; liked: boolean; likeCount: number }>,
    ) => {
      state.byThreadId[action.payload.threadId] = {
        liked: action.payload.liked,
        likeCount: action.payload.likeCount,
      };
    },
    setThreadLikeCount: (
      state,
      action: PayloadAction<{ threadId: string; likeCount: number }>,
    ) => {
      const current = state.byThreadId[action.payload.threadId];
      state.byThreadId[action.payload.threadId] = {
        liked: current?.liked ?? false,
        likeCount: action.payload.likeCount,
      };
    },
  },
});

export const { hydrateLikesFromThreads, setThreadLikeState, setThreadLikeCount } =
  likeSlice.actions;
export default likeSlice.reducer;
