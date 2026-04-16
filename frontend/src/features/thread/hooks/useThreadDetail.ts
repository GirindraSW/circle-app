import { useEffect, useState } from "react";
import {
  createReplyRequest,
  getThreadDetailRequest,
  getThreadRepliesRequest,
  type ThreadDetailApiItem,
  type ThreadReplyApiItem,
} from "../services/threadService";
import type { ThreadDetailItem, ThreadReplyItem } from "../types/thread.type";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setThreadLikeState } from "@/features/like/likeSlice";
import { likeThreadRequest, unlikeThreadRequest } from "../services/threadService";

export function useThreadDetail(threadId: string | undefined) {
  const dispatch = useAppDispatch();
  const likeByThreadId = useAppSelector((state) =>
    threadId ? state.like.byThreadId[threadId] : undefined,
  );
  const [thread, setThread] = useState<ThreadDetailItem | null>(null);
  const [replies, setReplies] = useState<ThreadReplyItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReplySubmitting, setIsReplySubmitting] = useState<boolean>(false);
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
        dispatch(
          setThreadLikeState({
            threadId,
            liked: threadResult.data.liked,
            likeCount: threadResult.data.likes,
          }),
        );
        setReplies(repliesResult.data.replies.map((item) => mapReply(item)));
      } catch {
        setErrorMessage("Gagal mengambil detail thread.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [threadId, dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !threadId) return;

    const wsBaseUrl = (import.meta.env.VITE_WS_URL || "ws://localhost:5000").replace(
      /\/$/,
      "",
    );
    const socket = new WebSocket(`${wsBaseUrl}/ws?token=${encodeURIComponent(token)}`);

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as {
          event: string;
          data: { threadId: string; reply: ThreadReplyApiItem };
        };

        if (payload.event !== "reply:created" || payload.data.threadId !== threadId) return;
        const mappedReply = mapReply(payload.data.reply);
        setReplies((prev) => [mappedReply, ...prev]);
        setThread((prev) => (prev ? { ...prev, replies: prev.replies + 1 } : prev));
      } catch {
        // ignore payload errors
      }
    };

    return () => {
      socket.close();
    };
  }, [threadId]);

  const submitReply = async (content: string, imageFile?: File | null) => {
    if (!threadId) return;

    const formData = new FormData();
    formData.append("content", content);
    if (imageFile) formData.append("image", imageFile);

    setIsReplySubmitting(true);
    setErrorMessage("");

    try {
      const result = await createReplyRequest(threadId, formData);
      const mappedReply = mapReply(result.data.reply);
      setReplies((prev) => [mappedReply, ...prev]);
      setThread((prev) => (prev ? { ...prev, replies: prev.replies + 1 } : prev));
    } catch {
      setErrorMessage("Gagal mengirim reply.");
      throw new Error("REPLY_FAILED");
    } finally {
      setIsReplySubmitting(false);
    }
  };

  const toggleLike = async () => {
    if (!threadId || !thread) return;

    const currentLiked = likeByThreadId?.liked ?? thread.liked;
    const currentLikeCount = likeByThreadId?.likeCount ?? thread.likes;
    const nextLiked = !currentLiked;
    const nextLikeCount = nextLiked ? currentLikeCount + 1 : currentLikeCount - 1;

    dispatch(setThreadLikeState({ threadId, liked: nextLiked, likeCount: nextLikeCount }));
    setThread((prev) =>
      prev
        ? {
            ...prev,
            liked: nextLiked,
            likes: nextLikeCount,
          }
        : prev,
    );

    try {
      if (nextLiked) {
        await likeThreadRequest(threadId);
      } else {
        await unlikeThreadRequest(threadId);
      }
    } catch {
      dispatch(
        setThreadLikeState({
          threadId,
          liked: currentLiked,
          likeCount: currentLikeCount,
        }),
      );
      setThread((prev) =>
        prev
          ? {
              ...prev,
              liked: currentLiked,
              likes: currentLikeCount,
            }
          : prev,
      );
      setErrorMessage("Gagal update like thread.");
    }
  };

  return {
    thread,
    replies,
    isLoading,
    isReplySubmitting,
    errorMessage,
    submitReply,
    toggleLike,
    likeState: likeByThreadId,
  };
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
