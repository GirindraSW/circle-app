import { LogOut } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Button } from "../components/ui/button";
import UserAvatar from "../components/UserAvatar";
import { logout } from "../features/auth/authSlice";
import { clearProfile, fetchProfile, updateProfile } from "../features/profile/profileSlice";
import ThreadList from "../features/thread/components/ThreadList";
import { useThreads } from "../features/thread/hooks/useThreads";

function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.profile.data);
  const profileStatus = useAppSelector((state) => state.profile.status);
  const { threads, isLoading, isPosting, toggleLike, createThread, errorMessage } =
    useThreads();
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSubmitError, setProfileSubmitError] = useState("");
  const [profileForm, setProfileForm] = useState({
    username: "",
    name: "",
    bio: "",
  });
  const [profileAvatarFile, setProfileAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (profileStatus === "idle") {
      void dispatch(fetchProfile());
    }
  }, [dispatch, profileStatus]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearProfile());
  };

  const handleThreadClick = (threadId: string) => {
    navigate(`/thread/${threadId}`);
  };

  const handleSubmitThread = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");

    if (!content.trim() && !selectedImage) {
      setSubmitError("Thread tidak boleh kosong.");
      return;
    }

    try {
      await createThread(content.trim(), selectedImage);
      setContent("");
      setSelectedImage(null);
    } catch {
      setSubmitError("Gagal mengirim thread.");
    }
  };

  const handleToggleEditProfile = () => {
    if (!isEditingProfile && profile) {
      setProfileForm({
        username: profile.username || "",
        name: profile.name || "",
        bio: profile.bio || "",
      });
      setProfileAvatarFile(null);
    }

    setIsEditingProfile((prev) => !prev);
  };

  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileSubmitError("");

    try {
      await dispatch(
        updateProfile({
          username: profileForm.username.trim(),
          name: profileForm.name.trim(),
          bio: profileForm.bio.trim(),
          avatarFile: profileAvatarFile,
        }),
      ).unwrap();
      setIsEditingProfile(false);
    } catch {
      setProfileSubmitError("Gagal update profile.");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:grid-cols-[2fr_1fr] sm:px-6">
        <div>
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-500">circle</h1>
            <p className="text-sm text-zinc-400">
              Welcome, {profile?.name || profile?.username || user?.name || user?.username || "User"}
            </p>
            <Link to="/follows?type=followers" className="text-xs text-zinc-400 hover:text-zinc-100">
              Open Follows
            </Link>
          </div>
          <Button
            variant="outline"
            className="border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </header>

        <h2 className="mb-4 text-xl font-semibold">Home</h2>
        <form
          onSubmit={handleSubmitThread}
          className="mb-5 space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4"
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="What is happening?!"
            className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
              className="text-xs text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-2 file:text-white"
            />
            <Button
              type="submit"
              disabled={isPosting}
              className="rounded-full bg-green-600 text-white hover:bg-green-500"
            >
              {isPosting ? "Posting..." : "Reply"}
            </Button>
          </div>
          {submitError ? <p className="text-sm text-red-400">{submitError}</p> : null}
        </form>

        {errorMessage ? (
          <p className="mb-4 rounded-xl border border-amber-700/40 bg-amber-950/30 p-3 text-sm text-amber-300">
            {errorMessage}
          </p>
        ) : null}
        {isLoading ? (
          <p className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-zinc-400">
            Loading threads...
          </p>
        ) : (
          <ThreadList
            threads={threads}
            onToggleLike={toggleLike}
            onThreadClick={handleThreadClick}
          />
        )}
        </div>

        <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">My Profile</h3>
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
              onClick={handleToggleEditProfile}
              type="button"
            >
              {isEditingProfile ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          {profileStatus === "loading" ? (
            <p className="text-sm text-zinc-400">Loading profile...</p>
          ) : null}

          {profile && !isEditingProfile ? (
            <div className="space-y-2">
              <UserAvatar
                src={profile.avatar}
                name={profile.name}
                seed={profile.username}
                className="h-20 w-20"
              />
              <p className="text-xl font-semibold">{profile.name}</p>
              <p className="text-sm text-zinc-400">@{profile.username}</p>
              <p className="text-sm text-zinc-300">{profile.bio || "No bio yet."}</p>
            </div>
          ) : null}

          {profile && isEditingProfile ? (
            <form className="space-y-3" onSubmit={handleProfileSubmit}>
              <input
                value={profileForm.username}
                onChange={(e) =>
                  setProfileForm((prev) => ({ ...prev, username: e.target.value }))
                }
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                placeholder="Username"
              />
              <input
                value={profileForm.name}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                placeholder="Full Name"
              />
              <div className="space-y-2">
                <label className="text-xs text-zinc-400">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileAvatarFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-2 file:text-white"
                />
                {profileAvatarFile ? (
                  <p className="text-xs text-zinc-400">Selected: {profileAvatarFile.name}</p>
                ) : null}
              </div>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                placeholder="Bio"
              />
              {profileSubmitError ? (
                <p className="text-sm text-red-400">{profileSubmitError}</p>
              ) : null}
              <Button
                type="submit"
                className="w-full rounded-full bg-green-600 text-white hover:bg-green-500"
              >
                Save Profile
              </Button>
            </form>
          ) : null}
        </aside>
      </section>
    </main>
  );
}

export default HomePage;
