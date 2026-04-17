import { useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";
import UserAvatar from "@/components/UserAvatar";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchProfile } from "@/features/profile/profileSlice";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.data);
  const profileStatus = useAppSelector((state) => state.profile.status);

  useEffect(() => {
    if (profileStatus === "idle") {
      void dispatch(fetchProfile());
    }
  }, [dispatch, profileStatus]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">
      <section className="mx-auto grid max-w-[1300px] lg:grid-cols-[240px_minmax(0,1fr)]">
        <AppSidebar />

        <section className="min-h-screen border-x border-blue-200 px-4 py-6 sm:px-6">
          <h2 className="mb-4 text-2xl font-semibold">Profile</h2>

          {profileStatus === "loading" ? (
            <p className="rounded-xl border border-blue-200 bg-white p-4 text-slate-500">
              Loading profile...
            </p>
          ) : null}

          {profile ? (
            <div className="max-w-lg space-y-3 rounded-2xl border border-blue-200 bg-white/80 p-5">
              <UserAvatar
                src={profile.avatar}
                name={profile.name}
                seed={profile.username}
                className="h-20 w-20"
              />
              <p className="text-2xl font-semibold">{profile.name}</p>
              <p className="text-sm text-slate-500">@{profile.username}</p>
              <p className="text-sm text-slate-700">{profile.bio || "No bio yet."}</p>
              <p className="text-xs text-slate-400">{profile.email}</p>
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}


