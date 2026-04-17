import { prisma } from "../../lib/prisma.js";

export const searchUsersByQuery = async (currentUserId: string, query: string) => {
  return prisma.user.findMany({
    where: {
      id: {
        not: currentUserId,
      },
      OR: [
        {
          username: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          full_name: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    select: {
      id: true,
      username: true,
      full_name: true,
      photo_profile: true,
    },
    take: 25,
  });
};

export const findFollowingIdsForUsers = async (currentUserId: string, targetUserIds: string[]) => {
  if (targetUserIds.length === 0) {
    return [];
  }

  return prisma.following.findMany({
    where: {
      follower_id: currentUserId,
      following_id: {
        in: targetUserIds,
      },
    },
    select: {
      following_id: true,
    },
  });
};

