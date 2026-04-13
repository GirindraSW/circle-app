import { prisma } from "../../lib/prisma.js";

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
