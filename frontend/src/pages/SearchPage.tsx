import { FormEvent, useMemo, useState } from "react";
import { Search } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import ProfilePreviewCard from "@/components/ProfilePreviewCard";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  followUserRequest,
  unfollowUserRequest,
} from "@/features/follow/services/followService";
import { searchUsersRequest } from "@/features/user/services/userService";
import type { SearchUserItem } from "@/features/user/types/user.type";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<SearchUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searched, setSearched] = useState(false);

  const trimmedQuery = useMemo(() => query.trim(), [query]);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSearched(true);

    if (!trimmedQuery) {
      setUsers([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await searchUsersRequest(trimmedQuery);
      setUsers(response.data.users || []);
    } catch {
      setErrorMessage("Failed to search users.");
    } finally {
      setIsLoading(false);
    }
  };

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
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="mx-auto grid max-w-[1300px] lg:grid-cols-[240px_minmax(0,1fr)_320px]">
        <AppSidebar />

        <section className="min-h-screen border-x border-zinc-800 px-4 py-6 sm:px-6">
          <h2 className="mb-4 text-2xl font-semibold">Search</h2>

          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-2">
              <Search className="h-4 w-4 text-zinc-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or username..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
              />
              <Button
                type="submit"
                size="sm"
                className="rounded-full bg-green-600 text-white hover:bg-green-500"
              >
                Search
              </Button>
            </div>
          </form>

          {errorMessage ? (
            <p className="mb-4 rounded-md border border-red-800/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
              {errorMessage}
            </p>
          ) : null}

          {isLoading ? (
            <p className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-zinc-400">
              Searching...
            </p>
          ) : null}

          {!isLoading && searched && users.length === 0 ? (
            <p className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-400">
              No users found.
            </p>
          ) : null}

          <div className="space-y-3">
            {users.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-3"
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
                    <p className="truncate text-xs text-zinc-400">@{item.username}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant={item.is_following ? "outline" : "default"}
                  className={
                    item.is_following
                      ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                      : "bg-green-600 text-white hover:bg-green-500"
                  }
                  onClick={() => void handleToggleFollow(item.id, item.is_following)}
                >
                  {item.is_following ? "Following" : "Follow"}
                </Button>
              </div>
            ))}
          </div>
        </section>

        <aside className="hidden p-4 lg:block">
          <ProfilePreviewCard />
        </aside>
      </section>
    </main>
  );
}

