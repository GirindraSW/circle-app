import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import ProfilePreviewCard from "@/components/ProfilePreviewCard";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  followUserRequest,
  getFollowsRequest,
  unfollowUserRequest,
} from "@/features/follow/services/followService";
import type { FollowListType, FollowUserItem } from "@/features/follow/types/follow.type";

export default function FollowsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get("type") === "following" ? "following" : "followers";
  const [type, setType] = useState<FollowListType>(initialType);
  const [users, setUsers] = useState<FollowUserItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    setSearchParams({ type });
  }, [type, setSearchParams]);

  useEffect(() => {
    const loadFollows = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const response = await getFollowsRequest(type);
        const list = type === "followers" ? response.data.followers : response.data.following;
        setUsers(list || []);
      } catch {
        setErrorMessage("Failed to fetch follow data.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadFollows();
  }, [type]);

  const pageTitle = useMemo(() => (type === "followers" ? "Followers" : "Following"), [type]);

  const handleToggleFollow = async (targetUserId: string, isFollowing: boolean) => {
    setUsers((prev) =>
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
      setUsers((prev) =>
        prev.map((item) =>
          item.id === targetUserId ? { ...item, is_following: isFollowing } : item,
        ),
      );
      setErrorMessage("Failed to update follow status.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">
      <section className="mx-auto grid max-w-[1300px] lg:grid-cols-[240px_minmax(0,1fr)_320px]">
        <AppSidebar />

        <section className="min-h-screen border-x border-blue-200 px-4 py-6 sm:px-6">
          <h2 className="mb-4 text-2xl font-semibold">Follows</h2>
          <div className="mb-4 flex gap-2">
            <Button
              type="button"
              variant={type === "followers" ? "default" : "outline"}
              className={
                type === "followers"
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "border-blue-200 bg-white text-slate-800 hover:bg-blue-100"
              }
              onClick={() => setType("followers")}
            >
              Followers
            </Button>
            <Button
              type="button"
              variant={type === "following" ? "default" : "outline"}
              className={
                type === "following"
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "border-blue-200 bg-white text-slate-800 hover:bg-blue-100"
              }
              onClick={() => setType("following")}
            >
              Following
            </Button>
          </div>

          <p className="mb-3 text-sm text-slate-500">{pageTitle}</p>
          {errorMessage ? (
            <p className="mb-3 rounded-md border border-red-800/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
              {errorMessage}
            </p>
          ) : null}

          {isLoading ? (
            <p className="rounded-xl border border-blue-200 bg-white p-4 text-slate-500">
              Loading {pageTitle.toLowerCase()}...
            </p>
          ) : (
            <div className="space-y-3">
              {users.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-blue-200 bg-white/90 px-3 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar
                      src={item.avatar}
                      name={item.name}
                      seed={item.username}
                      className="h-10 w-10"
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
                    onClick={() => void handleToggleFollow(item.id, item.is_following)}
                  >
                    {item.is_following ? "Following" : "Follow"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="hidden p-4 lg:block">
          <ProfilePreviewCard />
        </aside>
      </section>
    </main>
  );
}

