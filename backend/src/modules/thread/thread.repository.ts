import { prisma } from "../../lib/prisma.js";
import type { CreateThreadInput } from "./thread.type.js";

export const findAllThreads = async (currentUserId?: string) => {
  return prisma.thread.findMany({
    orderBy: {
      created_at: "desc",
    },
    include: {
      created_by_user: {
        select: {
          id: true,
          username: true,
          full_name: true,
          photo_profile: true,
        },
      },
      likes: currentUserId
        ? {
            where: {
              user_id: currentUserId,
            },
            select: {
              id: true,
            },
          }
        : {
            select: {
              id: true,
            },
          },
      _count: {
        select: {
          likes: true,
          replies: true,
        },
      },
    },
  });
};

export const createThreadRecord = async (payload: CreateThreadInput) => {
  return prisma.thread.create({
    data: {
      content: payload.content,
      image: payload.image,
      created_by: payload.userId,
      updated_by: payload.userId,
    },
    include: {
      created_by_user: {
        select: {
          id: true,
          username: true,
          full_name: true,
          photo_profile: true,
        },
      },
      likes: {
        where: {
          user_id: payload.userId,
        },
        select: {
          id: true,
        },
      },
      _count: {
        select: {
          likes: true,
          replies: true,
        },
      },
    },
  });
};

export const findThreadById = async (threadId: string, currentUserId?: string) => {
  return prisma.thread.findUnique({
    where: {
      id: threadId,
    },
    include: {
      created_by_user: {
        select: {
          id: true,
          username: true,
          full_name: true,
          photo_profile: true,
        },
      },
      likes: currentUserId
        ? {
            where: {
              user_id: currentUserId,
            },
            select: {
              id: true,
            },
          }
        : {
            select: {
              id: true,
            },
          },
      _count: {
        select: {
          likes: true,
          replies: true,
        },
      },
    },
  });
};

export const findRepliesByThreadId = async (threadId: string) => {
  return prisma.reply.findMany({
    where: {
      thread_id: threadId,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
          photo_profile: true,
        },
      },
    },
  });
};

export const createReplyRecord = async (payload: {
  threadId: string;
  userId: string;
  content: string;
  image?: string;
}) => {
  return prisma.reply.create({
    data: {
      thread_id: payload.threadId,
      user_id: payload.userId,
      content: payload.content,
      image: payload.image,
      created_by: payload.userId,
      updated_by: payload.userId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
          photo_profile: true,
        },
      },
    },
  });
};

export const findThreadExistence = async (threadId: string) => {
  return prisma.thread.findUnique({
    where: {
      id: threadId,
    },
    select: {
      id: true,
    },
  });
};

export const findLikeByUserAndThread = async (userId: string, threadId: string) => {
  return prisma.like.findUnique({
    where: {
      user_id_thread_id: {
        user_id: userId,
        thread_id: threadId,
      },
    },
  });
};

export const createLikeRecord = async (payload: { userId: string; threadId: string }) => {
  return prisma.like.create({
    data: {
      user_id: payload.userId,
      thread_id: payload.threadId,
      created_by: payload.userId,
      updated_by: payload.userId,
    },
  });
};

export const deleteLikeRecord = async (payload: { userId: string; threadId: string }) => {
  return prisma.like.delete({
    where: {
      user_id_thread_id: {
        user_id: payload.userId,
        thread_id: payload.threadId,
      },
    },
  });
};
