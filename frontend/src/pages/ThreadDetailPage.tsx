import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import ProfilePreviewCard from "@/components/ProfilePreviewCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UserAvatar from "@/components/UserAvatar";
import { useThreadDetail } from "@/features/thread/hooks/useThreadDetail";

export default function ThreadDetailPage() {
  const { threadId } = useParams<{ threadId: string }>();
  const {
    thread,
    replies,
    isLoading,
    isReplySubmitting,
    errorMessage,
    submitReply,
    toggleLike,
    likeState,
  } = useThreadDetail(threadId);
  const [replyContent, setReplyContent] = useState("");
  const [replyImage, setReplyImage] = useState<File | null>(null);

  const handleReplySubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!replyContent.trim() && !replyImage) return;

    try {
      await submitReply(replyContent.trim(), replyImage);
      setReplyContent("");
      setReplyImage(null);
    } catch {
      // handled in hook
    }
  };

  const liked = likeState?.liked ?? thread?.liked ?? false;
  const likes = likeState?.likeCount ?? thread?.likes ?? 0;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="mx-auto grid max-w-[1300px] lg:grid-cols-[240px_minmax(0,1fr)_320px]">
        <AppSidebar />

        <section className="min-h-screen border-x border-zinc-800 px-4 py-6 sm:px-6">
          <Link
            to="/home"
            className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <h2 className="mb-4 text-xl font-semibold">Status</h2>

          {isLoading ? (
            <p className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-zinc-400">
              Loading thread detail...
            </p>
          ) : null}

          {errorMessage ? (
            <p className="mb-4 rounded-xl border border-red-800/40 bg-red-950/30 p-3 text-sm text-red-300">
              {errorMessage}
            </p>
          ) : null}

          {thread ? (
            <Card className="mb-4 gap-3 rounded-2xl border-zinc-800 bg-zinc-950/80 text-zinc-100">
              <CardHeader className="flex flex-row items-start gap-3">
                <UserAvatar
                  src={thread.user.profile_picture}
                  name={thread.user.name}
                  seed={thread.user.username}
                  className="h-10 w-10"
                />
                <div>
                  <p className="text-sm font-semibold">{thread.user.name}</p>
                  <p className="text-xs text-zinc-400">@{thread.user.username}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-6">{thread.content}</p>
                {thread.image ? (
                  <img
                    src={thread.image}
                    alt="Thread attachment"
                    className="h-72 w-full rounded-xl object-cover"
                  />
                ) : null}
                <p className="text-xs text-zinc-500">{thread.createdAtLabel}</p>
                <div className="flex items-center gap-4 text-sm text-zinc-300">
                  <Button
                    variant={liked ? "default" : "outline"}
                    size="sm"
                    className={
                      liked
                        ? "bg-green-600 text-white hover:bg-green-500"
                        : "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
                    }
                    onClick={() => void toggleLike()}
                    type="button"
                  >
                    <Heart className="h-4 w-4" />
                    {likes}
                  </Button>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {thread.replies}
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <form
            onSubmit={handleReplySubmit}
            className="mb-4 space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4"
          >
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={3}
              placeholder="Type your reply..."
              className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setReplyImage(e.target.files?.[0] || null)}
                className="text-xs text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-700 file:px-3 file:py-2 file:text-white"
              />
              <Button
                type="submit"
                disabled={isReplySubmitting}
                className="rounded-full bg-green-600 text-white hover:bg-green-500"
              >
                {isReplySubmitting ? "Replying..." : "Reply"}
              </Button>
            </div>
          </form>

          <section className="space-y-3">
            {replies.map((reply) => (
              <Card
                key={reply.id}
                className="gap-3 rounded-2xl border-zinc-800 bg-zinc-950/80 text-zinc-100"
              >
                <CardHeader className="flex flex-row items-start gap-3">
                  <UserAvatar
                    src={reply.user.profile_picture}
                    name={reply.user.name}
                    seed={reply.user.username}
                    className="h-10 w-10"
                  />
                  <div>
                    <p className="text-sm font-semibold">{reply.user.name}</p>
                    <p className="text-xs text-zinc-400">
                      @{reply.user.username} - {reply.createdAtLabel}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm leading-6">{reply.content}</p>
                  {reply.image ? (
                    <img
                      src={reply.image}
                      alt="Reply attachment"
                      className="h-52 w-full rounded-xl object-cover"
                    />
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </section>
        </section>

        <aside className="hidden p-4 lg:block">
          <ProfilePreviewCard />
        </aside>
      </section>
    </main>
  );
}
