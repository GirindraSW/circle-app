import { useEffect, useState } from "react";
import {
  getThreadDetailRequest,
  getThreadRepliesRequest,
  type ThreadDetailApiItem,
  type ThreadReplyApiItem,
} from "../services/threadService";
import type { ThreadDetailItem, ThreadReplyItem } from "../types/thread.type";

export function useThreadDetail(threadId: string | undefined) {
  const [thread, setThread] = useState<ThreadDetailItem | null>(null);
  const [replies, setReplies] = useState<ThreadReplyItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!threadId) {
      setErrorMessage("Thread ID tidak valid.");
      setIsLoading(false);
      return;
    }

    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [threadResult, repliesResult] = await Promise.all([
          getThreadDetailRequest(threadId),
          getThreadRepliesRequest(threadId),
        ]);

        setThread(mapThreadDetail(threadResult.data));
        setReplies(repliesResult.data.replies.map((item) => mapReply(item)));
      } catch {
        setErrorMessage("Gagal mengambil detail thread.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [threadId]);

  return { thread, replies, isLoading, errorMessage };
}

const mapThreadDetail = (thread: ThreadDetailApiItem): ThreadDetailItem => ({
  id: thread.id,
  content: thread.content,
  image: thread.image || undefined,
  createdAtLabel: formatThreadDate(thread.createdAt),
  likes: thread.likes,
  replies: thread.replies,
  liked: thread.liked,
  user: {
    id: thread.user.id,
    username: thread.user.username,
    name: thread.user.name,
    profile_picture: thread.user.profile_picture,
  },
});

const mapReply = (reply: ThreadReplyApiItem): ThreadReplyItem => ({
  id: reply.id,
  content: reply.content,
  image: reply.image || undefined,
  createdAtLabel: formatThreadDate(reply.created_at),
  user: {
    id: reply.user.id,
    username: reply.user.username,
    name: reply.user.name,
    profile_picture: reply.user.profile_picture,
  },
});

const formatThreadDate = (value: string) => {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));

  if (diffMin < 60) return `${Math.max(diffMin, 1)}m`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};
