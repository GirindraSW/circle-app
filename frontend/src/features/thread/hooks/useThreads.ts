import { useEffect, useState } from "react";
import { getThreadsRequest } from "../services/threadService";
import type { ThreadItem } from "../types/thread.type";

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
  const [threads, setThreads] = useState<ThreadItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const loadThreads = async () => {
      try {
        const result = await getThreadsRequest();
        const mappedThreads: ThreadItem[] = result.data.map((thread) => ({
          id: thread.id,
          authorName: thread.author.name,
          authorUsername: thread.author.username,
          authorAvatar: thread.author.avatar || "https://i.pravatar.cc/100?img=3",
          content: thread.content,
          image: thread.image || undefined,
          createdAtLabel: formatThreadDate(thread.createdAt),
          likeCount: thread.likeCount,
          replyCount: thread.replyCount,
          liked: thread.liked,
        }));

        setThreads(mappedThreads);
      } catch {
        setThreads(DUMMY_THREADS);
        setErrorMessage("Gagal load dari API, menampilkan dummy data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadThreads();
  }, []);

  const toggleLike = (threadId: string) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) => {
        if (thread.id !== threadId) return thread;
        const nextLiked = !thread.liked;
        return {
          ...thread,
          liked: nextLiked,
          likeCount: nextLiked ? thread.likeCount + 1 : thread.likeCount - 1,
        };
      }),
    );
  };

  return { threads, isLoading, toggleLike, errorMessage };
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
