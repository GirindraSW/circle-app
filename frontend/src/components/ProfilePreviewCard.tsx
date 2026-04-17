import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import UserAvatar from "@/components/UserAvatar";
import { fetchProfile } from "@/features/profile/profileSlice";

export default function ProfilePreviewCard() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.data);
  const profileStatus = useAppSelector((state) => state.profile.status);

  useEffect(() => {
    if (profileStatus === "idle") {
      void dispatch(fetchProfile());
    }
  }, [dispatch, profileStatus]);

  if (!profile) {
    return (
      <section className="rounded-2xl border border-blue-200 bg-white/80 p-4">
        <p className="text-sm text-slate-500">Loading profile...</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-blue-200 bg-white/80 p-4">
      <h3 className="mb-3 text-lg font-semibold">My Profile</h3>
      <div className="space-y-2">
        <UserAvatar
          src={profile.avatar}
          name={profile.name}
          seed={profile.username}
          className="h-16 w-16"
        />
        <p className="text-xl font-semibold">{profile.name}</p>
        <p className="text-sm text-slate-500">@{profile.username}</p>
        <p className="text-sm text-slate-600">{profile.bio || "No bio yet."}</p>
      </div>
    </section>
  );
}


