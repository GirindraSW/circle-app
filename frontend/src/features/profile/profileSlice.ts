import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { meRequest, type ProfileData, updateMeRequest } from "@/services/authService";

type ProfileState = {
  data: ProfileData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: ProfileState = {
  data: null,
  status: "idle",
  error: null,
};

export const fetchProfile = createAsyncThunk("profile/fetchProfile", async () => {
  const response = await meRequest();
  return response.data;
});

type UpdateProfileInput = {
  username?: string;
  name?: string;
  bio?: string;
  avatarFile?: File | null;
};

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (payload: UpdateProfileInput) => {
    const formData = new FormData();
    if (payload.username !== undefined) formData.append("username", payload.username);
    if (payload.name !== undefined) formData.append("name", payload.name);
    if (payload.bio !== undefined) formData.append("bio", payload.bio);
    if (payload.avatarFile) formData.append("avatar", payload.avatarFile);

    const response = await updateMeRequest(formData);
    return response.data;
  },
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<ProfileData>) => {
      state.data = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    updateProfileInStore: (state, action: PayloadAction<Partial<ProfileData>>) => {
      if (!state.data) return;
      state.data = { ...state.data, ...action.payload };
    },
    clearProfile: (state) => {
      state.data = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.status = "failed";
        state.error = "Failed to load profile";
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.status = "failed";
        state.error = "Failed to update profile";
      });
  },
});

export const { setProfile, updateProfileInStore, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
