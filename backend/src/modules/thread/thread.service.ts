import {
  broadcastReplyCreated,
  broadcastThreadCreated,
  broadcastThreadLikeUpdated,
} from "../../realtime/ws.js";
import { enqueueThreadImage } from "../../queue/thread.queue.js";
import {
  createLikeRecord,
  createReplyRecord,
  createThreadRecord,
  deleteThreadRecord,
  deleteLikeRecord,
  findAllThreads,
  findLikeByUserAndThread,
  findThreadLikeCount,
  findThreadOwnerById,
  findRepliesByThreadId,
  findThreadExistence,
  findThreadById,
  updateThreadRecord,
} from "./thread.repository.js";
import type {
  CreateThreadInput,
  ThreadDetailItem,
  ThreadListItem,
  ThreadReplyItem,
} from "./thread.type.js";

export const getThreadList = async (currentUserId?: string): Promise<ThreadListItem[]> => {
  const threads = await findAllThreads(currentUserId);

  return threads.map((thread) => mapThreadEntity(thread));
};

export const createThread = async (payload: CreateThreadInput): Promise<ThreadListItem> => {
  const createdThread = await createThreadRecord(payload);
  const mappedThread = mapThreadEntity(createdThread);

  if (payload.image) {
    enqueueThreadImage({
      source: "thread",
      sourceId: createdThread.id,
      imageFileName: payload.image,
    });
  }

  broadcastThreadCreated(mappedThread);

  return mappedThread;
};

export const updateThread = async (payload: {
  threadId: string;
  userId: string;
  content: string;
}): Promise<ThreadListItem> => {
  const threadOwner = await findThreadOwnerById(payload.threadId);
  if (!threadOwner) {
    throw new Error("THREAD_NOT_FOUND");
  }

  if (threadOwner.created_by !== payload.userId) {
    throw new Error("FORBIDDEN");
  }

  const updatedThread = await updateThreadRecord(payload);
  return mapThreadEntity(updatedThread);
};

export const deleteThread = async (payload: { threadId: string; userId: string }) => {
  const threadOwner = await findThreadOwnerById(payload.threadId);
  if (!threadOwner) {
    throw new Error("THREAD_NOT_FOUND");
  }

  if (threadOwner.created_by !== payload.userId) {
    throw new Error("FORBIDDEN");
  }

  return deleteThreadRecord(payload.threadId);
};

export const createReply = async (payload: {
  threadId: string;
  userId: string;
  content: string;
  image?: string;
}): Promise<ThreadReplyItem> => {
  const thread = await findThreadExistence(payload.threadId);
  if (!thread) {
    throw new Error("THREAD_NOT_FOUND");
  }

  const createdReply = await createReplyRecord(payload);

  if (payload.image) {
    enqueueThreadImage({
      source: "reply",
      sourceId: createdReply.id,
      imageFileName: payload.image,
    });
  }

  const appUrl = process.env.APP_URL || "http://localhost:5000";
  const mappedReply: ThreadReplyItem = {
    id: createdReply.id,
    content: createdReply.content,
    image: createdReply.image ? `${appUrl}/uploads/${createdReply.image}` : null,
    created_at: createdReply.created_at,
    user: {
      id: createdReply.user?.id ?? null,
      username: createdReply.user?.username ?? "unknown",
      name: createdReply.user?.full_name ?? "Unknown User",
      profile_picture: createdReply.user?.photo_profile ?? null,
    },
  };

  broadcastReplyCreated({
    threadId: payload.threadId,
    reply: mappedReply,
  });

  return mappedReply;
};

export const likeThread = async (userId: string, threadId: string) => {
  const thread = await findThreadExistence(threadId);
  if (!thread) {
    throw new Error("THREAD_NOT_FOUND");
  }

  const existingLike = await findLikeByUserAndThread(userId, threadId);
  if (existingLike) {
    throw new Error("ALREADY_LIKED");
  }

  await createLikeRecord({ userId, threadId });
  const likeCount = await findThreadLikeCount(threadId);

  broadcastThreadLikeUpdated({
    threadId,
    userId,
    liked: true,
    likeCount,
  });
};

export const unlikeThread = async (userId: string, threadId: string) => {
  const existingLike = await findLikeByUserAndThread(userId, threadId);
  if (!existingLike) {
    throw new Error("LIKE_NOT_FOUND");
  }

  await deleteLikeRecord({ userId, threadId });
  const likeCount = await findThreadLikeCount(threadId);

  broadcastThreadLikeUpdated({
    threadId,
    userId,
    liked: false,
    likeCount,
  });
};

export const getThreadDetail = async (
  threadId: string,
  currentUserId?: string,
): Promise<ThreadDetailItem | null> => {
  const thread = await findThreadById(threadId, currentUserId);
  if (!thread) return null;

  const appUrl = process.env.APP_URL || "http://localhost:5000";

  return {
    id: thread.id,
    content: thread.content,
    image: thread.image ? `${appUrl}/uploads/${thread.image}` : null,
    createdAt: thread.created_at,
    likes: thread._count.likes,
    replies: thread._count.replies,
    liked: thread.likes.length > 0,
    user: {
      id: thread.created_by_user?.id ?? null,
      username: thread.created_by_user?.username ?? "unknown",
      name: thread.created_by_user?.full_name ?? "Unknown User",
      profile_picture: thread.created_by_user?.photo_profile ?? null,
    },
  };
};

export const getThreadReplies = async (threadId: string): Promise<ThreadReplyItem[]> => {
  const replies = await findRepliesByThreadId(threadId);

  return replies.map((reply) => {
    const appUrl = process.env.APP_URL || "http://localhost:5000";

    return {
      id: reply.id,
      content: reply.content,
      image: reply.image ? `${appUrl}/uploads/${reply.image}` : null,
      created_at: reply.created_at,
      user: {
        id: reply.user?.id ?? null,
        username: reply.user?.username ?? "unknown",
        name: reply.user?.full_name ?? "Unknown User",
        profile_picture: reply.user?.photo_profile ?? null,
      },
    };
  });
};

const mapThreadEntity = (thread: {
  id: string;
  content: string;
  image: string | null;
  created_at: Date;
  likes: { id: string }[];
  _count: { likes: number; replies: number };
  created_by_user:
    | {
        id: string;
        username: string;
        full_name: string;
        photo_profile: string | null;
      }
    | null;
}): ThreadListItem => {
  const appUrl = process.env.APP_URL || "http://localhost:5000";

  return {
    id: thread.id,
    content: thread.content,
    image: thread.image ? `${appUrl}/uploads/${thread.image}` : null,
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
  };
};
