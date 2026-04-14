import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useThreadDetail } from "@/features/thread/hooks/useThreadDetail";

export default function ThreadDetailPage() {
  const { threadId } = useParams<{ threadId: string }>();
  const { thread, replies, isLoading, errorMessage } = useThreadDetail(threadId);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
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
              <img
                src={thread.user.profile_picture || "https://i.pravatar.cc/100?img=5"}
                alt={thread.user.name}
                className="h-10 w-10 rounded-full object-cover"
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
                <span className="inline-flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {thread.likes}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {thread.replies}
                </span>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <section className="space-y-3">
          {replies.map((reply) => (
            <Card
              key={reply.id}
              className="gap-3 rounded-2xl border-zinc-800 bg-zinc-950/80 text-zinc-100"
            >
              <CardHeader className="flex flex-row items-start gap-3">
                <img
                  src={reply.user.profile_picture || "https://i.pravatar.cc/100?img=8"}
                  alt={reply.user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">{reply.user.name}</p>
                  <p className="text-xs text-zinc-400">
                    @{reply.user.username} • {reply.createdAtLabel}
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
    </main>
  );
}
