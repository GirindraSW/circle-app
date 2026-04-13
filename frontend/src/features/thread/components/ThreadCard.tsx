import { Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ThreadItem } from "../types/thread.type";

type ThreadCardProps = {
  thread: ThreadItem;
  onToggleLike: (threadId: string) => void;
};

export default function ThreadCard({ thread, onToggleLike }: ThreadCardProps) {
  return (
    <Card className="gap-3 rounded-2xl border-zinc-800 bg-zinc-950/80 text-zinc-100">
      <CardHeader className="flex flex-row items-start gap-3">
        <img
          src={thread.authorAvatar}
          alt={thread.authorName}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{thread.authorName}</p>
          <p className="text-xs text-zinc-400">
            @{thread.authorUsername} • {thread.createdAtLabel}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-6 text-zinc-100">{thread.content}</p>
        {thread.image ? (
          <img
            src={thread.image}
            alt="Thread attachment"
            className="h-64 w-full rounded-xl object-cover"
          />
        ) : null}

        <div className="flex items-center gap-2 text-sm">
          <Button
            variant={thread.liked ? "default" : "outline"}
            size="sm"
            className={
              thread.liked
                ? "bg-green-600 text-white hover:bg-green-500"
                : "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
            }
            onClick={() => onToggleLike(thread.id)}
            type="button"
          >
            <Heart className="h-4 w-4" />
            {thread.liked ? "Liked" : "Like"}
          </Button>
          <span className="text-zinc-400">{thread.likeCount}</span>
          <MessageCircle className="ml-2 h-4 w-4 text-zinc-400" />
          <span className="text-zinc-400">{thread.replyCount}</span>
        </div>
      </CardContent>
    </Card>
  );
}