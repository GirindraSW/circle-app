import { Heart, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAppSelector } from "@/app/hooks";
import UserAvatar from "@/components/UserAvatar";
import type { ThreadItem } from "../types/thread.type";

type ThreadCardProps = {
  thread: ThreadItem;
  onToggleLike: (threadId: string) => void | Promise<void>;
  onEditThread: (thread: ThreadItem) => void | Promise<void>;
  onDeleteThread: (thread: ThreadItem) => void | Promise<void>;
  isOwner?: boolean;
  onClick?: (threadId: string) => void;
};

export default function ThreadCard({
  thread,
  onToggleLike,
  onEditThread,
  onDeleteThread,
  isOwner,
  onClick,
}: ThreadCardProps) {
  const likeState = useAppSelector((state) => state.like.byThreadId[thread.id]);
  const liked = likeState?.liked ?? thread.liked;
  const likeCount = likeState?.likeCount ?? thread.likeCount;

  return (
    <Card
      className="cursor-pointer gap-3 rounded-2xl border-blue-200 bg-white/90 text-slate-800"
      onClick={() => onClick?.(thread.id)}
    >
      <CardHeader className="flex flex-row items-start gap-3">
        <UserAvatar
          src={thread.authorAvatar}
          name={thread.authorName}
          seed={thread.authorUsername}
          className="h-10 w-10"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{thread.authorName}</p>
          <p className="text-xs text-slate-500">
            @{thread.authorUsername} - {thread.createdAtLabel}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-6 text-slate-800">{thread.content}</p>
        {thread.image ? (
          <img
            src={thread.image}
            alt="Thread attachment"
            className="h-64 w-full rounded-xl object-cover"
          />
        ) : null}

        <div className="flex items-center gap-2 text-sm">
          <Button
            variant={liked ? "default" : "outline"}
            size="sm"
            className={
              liked
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "border-blue-200 bg-white text-slate-800 hover:bg-blue-100"
            }
            onClick={(event) => {
              event.stopPropagation();
              onToggleLike(thread.id);
            }}
            type="button"
          >
            <Heart className="h-4 w-4" />
            {liked ? "Liked" : "Like"}
          </Button>
          <span className="text-slate-500">{likeCount}</span>
          <MessageCircle className="ml-2 h-4 w-4 text-slate-500" />
          <span className="text-slate-500">{thread.replyCount}</span>
          {isOwner ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto border-blue-200 bg-white text-slate-800 hover:bg-blue-100"
                onClick={(event) => {
                  event.stopPropagation();
                  void onEditThread(thread);
                }}
                type="button"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-700 bg-white text-red-300 hover:bg-red-950/30"
                onClick={(event) => {
                  event.stopPropagation();
                  void onDeleteThread(thread);
                }}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

