import { findAllThreads } from "./thread.repository.js";
import type { ThreadListItem } from "./thread.type.js";

export const getThreadList = async (currentUserId?: string): Promise<ThreadListItem[]> => {
  const threads = await findAllThreads(currentUserId);

  return threads.map((thread) => ({
    id: thread.id,
    content: thread.content,
    image: thread.image,
    createdAt: thread.created_at,
    likeCount: thread._count.likes,
    replyCount: thread._count.replies,
    liked: thread.likes.length > 0,
    author: {
      id: thread.created_by_user?.id ?? null,
      username: thread.created_by_user?.username ?? "unknown",
      name: thread.created_by_user?.full_name ?? "Unknown User",
      avatar: thread.created_by_user?.photo_profile ?? null,
    },
  }));
};
