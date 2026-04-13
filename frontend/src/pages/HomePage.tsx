import { LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Button } from "../components/ui/button";
import { logout } from "../features/auth/authSlice";
import ThreadList from "../features/thread/components/ThreadList";
import { useThreads } from "../features/thread/hooks/useThreads";

function HomePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { threads, isLoading, toggleLike, errorMessage } = useThreads();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-500">circle</h1>
            <p className="text-sm text-zinc-400">
              Welcome, {user?.name || user?.username || "User"}
            </p>
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
          <ThreadList threads={threads} onToggleLike={toggleLike} />
        )}
      </section>
    </main>
  );
}

export default HomePage;
