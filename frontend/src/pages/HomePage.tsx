import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import AppSidebar from "../components/AppSidebar";
import { Button } from "../components/ui/button";
import UserAvatar from "../components/UserAvatar";
import { followUserRequest, unfollowUserRequest } from "../features/follow/services/followService";
import { fetchProfile, updateProfile } from "../features/profile/profileSlice";
import ThreadList from "../features/thread/components/ThreadList";
import { useThreads } from "../features/thread/hooks/useThreads";
import { getSuggestedUsersRequest } from "../features/user/services/userService";
import type { SearchUserItem } from "../features/user/types/user.type";

function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.profile.data);
  const profileStatus = useAppSelector((state) => state.profile.status);
  const {
    threads,
    isLoading,
    isPosting,
    toggleLike,
    createThread,
    editThread,
    deleteThread,
    currentUserId,
    errorMessage,
  } = useThreads();
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
  const [suggestedUsers, setSuggestedUsers] = useState<SearchUserItem[]>([]);
  const [isSuggestedLoading, setIsSuggestedLoading] = useState<boolean>(true);
  const [suggestedError, setSuggestedError] = useState<string>("");

  useEffect(() => {
    if (profileStatus === "idle") {
      void dispatch(fetchProfile());
    }
  }, [dispatch, profileStatus]);

  useEffect(() => {
    const loadSuggestedUsers = async () => {
      try {
        setIsSuggestedLoading(true);
        setSuggestedError("");

        const response = await getSuggestedUsersRequest();
        setSuggestedUsers(response.data.users.slice(0, 5));
      } catch {
        setSuggestedError("Gagal memuat user recommendation.");
      } finally {
        setIsSuggestedLoading(false);
      }
    };

    void loadSuggestedUsers();
  }, []);

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

  const handleEditThread = async (threadId: string, previousContent: string) => {
    const nextContent = window.prompt("Edit thread kamu:", previousContent);
    if (nextContent === null) return;

    if (!nextContent.trim()) {
      setSubmitError("Isi thread tidak boleh kosong.");
      return;
    }

    setSubmitError("");

    try {
      await editThread(threadId, nextContent);
    } catch {
      setSubmitError("Gagal update thread.");
    }
  };

  const handleDeleteThread = async (threadId: string) => {
    const confirmed = window.confirm("Yakin ingin menghapus thread ini?");
    if (!confirmed) return;

    setSubmitError("");

    try {
      await deleteThread(threadId);
    } catch {
      setSubmitError("Gagal hapus thread.");
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

  const handleToggleSuggestedFollow = async (targetUserId: string, isFollowing: boolean) => {
    setSuggestedUsers((prev) =>
      prev.map((item) =>
        item.id === targetUserId ? { ...item, is_following: !isFollowing } : item,
      ),
    );

    try {
      if (isFollowing) {
        await unfollowUserRequest(targetUserId);
      } else {
        await followUserRequest(targetUserId);
      }
    } catch {
      setSuggestedUsers((prev) =>
        prev.map((item) =>
          item.id === targetUserId ? { ...item, is_following: isFollowing } : item,
        ),
      );
      setSuggestedError("Gagal update follow status.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">
      <section className="mx-auto grid max-w-[1300px] lg:grid-cols-[240px_minmax(0,1fr)_320px]">
        <AppSidebar />

        <section className="min-h-screen border-x border-blue-200 px-4 py-6 sm:px-6">
          <header className="mb-6">
            <h2 className="text-2xl font-semibold">Home</h2>
            <p className="text-sm text-slate-500">
              Welcome, {profile?.name || profile?.username || user?.name || user?.username || "User"}
            </p>
          </header>

          <form
            onSubmit={handleSubmitThread}
            className="mb-5 space-y-3 rounded-2xl border border-blue-200 bg-white/90 p-4"
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="What is happening?!"
              className="w-full resize-none rounded-xl border border-blue-200 bg-slate-100 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                className="text-xs text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-500 file:px-3 file:py-2 file:text-white"
              />
              <Button
                type="submit"
                disabled={isPosting}
                className="rounded-full bg-blue-500 text-white hover:bg-blue-600"
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
            <p className="rounded-xl border border-blue-200 bg-white p-4 text-slate-500">
              Loading threads...
            </p>
          ) : (
            <ThreadList
              threads={threads}
              onToggleLike={toggleLike}
              onEditThread={(thread) => handleEditThread(thread.id, thread.content)}
              onDeleteThread={(thread) => handleDeleteThread(thread.id)}
              currentUserId={currentUserId || user?.user_id}
              onThreadClick={handleThreadClick}
            />
          )}
        </section>

        <aside className="h-fit p-4">
          <section className="rounded-2xl border border-blue-200 bg-white/80 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">My Profile</h3>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-200 bg-white text-slate-800 hover:bg-blue-100"
              onClick={handleToggleEditProfile}
              type="button"
            >
              {isEditingProfile ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          {profileStatus === "loading" ? (
            <p className="text-sm text-slate-500">Loading profile...</p>
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
              <p className="text-sm text-slate-500">@{profile.username}</p>
              <p className="text-sm text-slate-600">{profile.bio || "No bio yet."}</p>
            </div>
          ) : null}

          {profile && isEditingProfile ? (
            <form className="space-y-3" onSubmit={handleProfileSubmit}>
              <input
                value={profileForm.username}
                onChange={(e) =>
                  setProfileForm((prev) => ({ ...prev, username: e.target.value }))
                }
                className="w-full rounded-md border border-blue-200 bg-slate-100 px-3 py-2 text-sm"
                placeholder="Username"
              />
              <input
                value={profileForm.name}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-md border border-blue-200 bg-slate-100 px-3 py-2 text-sm"
                placeholder="Full Name"
              />
              <div className="space-y-2">
                <label className="text-xs text-slate-500">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileAvatarFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-500 file:px-3 file:py-2 file:text-white"
                />
                {profileAvatarFile ? (
                  <p className="text-xs text-slate-500">Selected: {profileAvatarFile.name}</p>
                ) : null}
              </div>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm((prev) => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full rounded-md border border-blue-200 bg-slate-100 px-3 py-2 text-sm"
                placeholder="Bio"
              />
              {profileSubmitError ? (
                <p className="text-sm text-red-400">{profileSubmitError}</p>
              ) : null}
              <Button
                type="submit"
                className="w-full rounded-full bg-blue-500 text-white hover:bg-blue-600"
              >
                Save Profile
              </Button>
            </form>
          ) : null}
          </section>

          <section className="mt-4 rounded-2xl border border-blue-200 bg-white/80 p-4">
            <h3 className="mb-3 text-lg font-semibold">Suggested for you</h3>
            {suggestedError ? (
              <p className="mb-3 text-sm text-red-400">{suggestedError}</p>
            ) : null}
            {isSuggestedLoading ? (
              <p className="text-sm text-slate-500">Loading suggestions...</p>
            ) : null}
            {!isSuggestedLoading && suggestedUsers.length === 0 ? (
              <p className="text-sm text-slate-500">Belum ada user lain untuk direkomendasikan.</p>
            ) : null}
            <div className="space-y-3">
              {suggestedUsers.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <UserAvatar
                      src={item.avatar}
                      name={item.name}
                      seed={item.username}
                      className="h-9 w-9"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{item.name}</p>
                      <p className="truncate text-xs text-slate-500">@{item.username}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant={item.is_following ? "outline" : "default"}
                    className={
                      item.is_following
                        ? "border-blue-200 bg-white text-slate-800 hover:bg-blue-100"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }
                    onClick={() => void handleToggleSuggestedFollow(item.id, item.is_following)}
                  >
                    {item.is_following ? "Following" : "Follow"}
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

export default HomePage;

