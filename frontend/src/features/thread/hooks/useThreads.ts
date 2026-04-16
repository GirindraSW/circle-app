import { useEffect, useState } from "react";
import {
  createThreadRequest,
  getThreadsRequest,
  likeThreadRequest,
  type ThreadApiItem,
  unlikeThreadRequest,
} from "../services/threadService";
import type { ThreadItem } from "../types/thread.type";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  hydrateLikesFromThreads,
  setThreadLikeState,
} from "@/features/like/likeSlice";

const DUMMY_THREADS: ThreadItem[] = [
  {
    id: "thread-1",
    authorName: "Stella Audhina",
    authorUsername: "audhinafh",
    authorAvatar: "https://i.pravatar.cc/100?img=24",
    content: "Hari ini mulai build List Thread pakai clean architecture. Gas terus!",
    createdAtLabel: "10m",
    likeCount: 14,
    replyCount: 3,
    liked: false,
  },
  {
    id: "thread-2",
    authorName: "Tuanti Gabelas",
    authorUsername: "tuantigabelas",
    authorAvatar: "https://i.pravatar.cc/100?img=31",
    content:
      "Buat yang lagi belajar fullstack, pisahkan concern UI, state, dan API dari awal. Lebih enak pas scale.",
    createdAtLabel: "1h",
    likeCount: 29,
    replyCount: 8,
    liked: true,
  },
  {
    id: "thread-3",
    authorName: "Compounding Quality",
    authorUsername: "qCompounding",
    authorAvatar: "https://i.pravatar.cc/100?img=12",
    content: "52 buku yang harus kamu baca kalau mau naik level tahun ini.",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
    createdAtLabel: "Jul 25",
    likeCount: 293,
    replyCount: 381,
    liked: false,
  },
];

export function useThreads() {
  const dispatch = useAppDispatch();
  const likeByThreadId = useAppSelector((state) => state.like.byThreadId);
  const [threads, setThreads] = useState<ThreadItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const loadThreads = async () => {
      try {
        const result = await getThreadsRequest();
        const mappedThreads: ThreadItem[] = result.data.map((thread) =>
          mapThreadFromApi(thread),
        );

        setThreads(mappedThreads);
        dispatch(hydrateLikesFromThreads(mappedThreads));
      } catch {
        setThreads(DUMMY_THREADS);
        setErrorMessage("Gagal load dari API, menampilkan dummy data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadThreads();
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const wsBaseUrl = (import.meta.env.VITE_WS_URL || "ws://localhost:5000").replace(
      /\/$/,
      "",
    );
    const socket = new WebSocket(`${wsBaseUrl}/ws?token=${encodeURIComponent(token)}`);

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as {
          event: string;
          data: ThreadApiItem;
        };

        if (payload.event !== "thread:created") return;

        const mapped = mapThreadFromApi(payload.data);
        setThreads((prev) => {
          if (prev.some((item) => item.id === mapped.id)) return prev;
          return [mapped, ...prev];
        });
        dispatch(
          setThreadLikeState({
            threadId: mapped.id,
            liked: mapped.liked,
            likeCount: mapped.likeCount,
          }),
        );
      } catch {
        // Ignore malformed WS payload.
      }
    };

    return () => {
      socket.close();
    };
  }, [dispatch]);

  const toggleLike = async (threadId: string) => {
    const thread = threads.find((item) => item.id === threadId);
    if (!thread) return;

    const currentLike = likeByThreadId[threadId];
    const currentLiked = currentLike?.liked ?? thread.liked;
    const currentLikeCount = currentLike?.likeCount ?? thread.likeCount;
    const nextLiked = !currentLiked;
    const nextLikeCount = nextLiked ? currentLikeCount + 1 : currentLikeCount - 1;

    dispatch(
      setThreadLikeState({
        threadId,
        liked: nextLiked,
        likeCount: nextLikeCount,
      }),
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
      setErrorMessage("Gagal update like.");
    }
  };

  const createThread = async (content: string, imageFile?: File | null) => {
    const formData = new FormData();
    formData.append("content", content);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    setIsPosting(true);
    setErrorMessage("");

    try {
      const result = await createThreadRequest(formData);
      const mapped = mapThreadFromApi(result.data);
      setThreads((prev) => [mapped, ...prev]);
    } catch (error) {
      setErrorMessage("Gagal membuat thread.");
      throw error;
    } finally {
      setIsPosting(false);
    }
  };

  return { threads, isLoading, isPosting, toggleLike, createThread, errorMessage };
}

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

const mapThreadFromApi = (thread: ThreadApiItem): ThreadItem => ({
  id: thread.id,
  authorName: thread.author.name,
  authorUsername: thread.author.username,
  authorAvatar: thread.author.avatar || undefined,
  content: thread.content,
  image: thread.image || undefined,
  createdAtLabel: formatThreadDate(thread.createdAt),
  likeCount: thread.likeCount,
  replyCount: thread.replyCount,
  liked: thread.liked,
});
