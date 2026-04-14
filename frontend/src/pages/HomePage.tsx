import { LogOut } from "lucide-react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Button } from "../components/ui/button";
import { logout } from "../features/auth/authSlice";
import ThreadList from "../features/thread/components/ThreadList";
import { useThreads } from "../features/thread/hooks/useThreads";

function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const { threads, isLoading, isPosting, toggleLike, createThread, errorMessage } =
    useThreads();
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState("");

  const handleLogout = () => {
    dispatch(logout());
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
      </section>
    </main>
  );
}

export default HomePage;
