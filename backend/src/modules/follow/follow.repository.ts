import { prisma } from "../../lib/prisma.js";

export const findFollowersByUserId = async (currentUserId: string) => {
  return prisma.following.findMany({
    where: {
      following_id: currentUserId,
    },
    include: {
      follower: {
        select: {
          id: true,
          username: true,
          full_name: true,
          photo_profile: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

export const findFollowingByUserId = async (currentUserId: string) => {
  return prisma.following.findMany({
    where: {
      follower_id: currentUserId,
    },
    include: {
      following: {
        select: {
          id: true,
          username: true,
          full_name: true,
          photo_profile: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

export const findMutualFollowing = async (currentUserId: string, userIds: string[]) => {
  if (userIds.length === 0) return [];
  return prisma.following.findMany({
    where: {
      follower_id: currentUserId,
      following_id: {
        in: userIds,
      },
    },
    select: {
      following_id: true,
    },
  });
};

export const createFollowRecord = async (followerId: string, followingId: string) => {
  return prisma.following.create({
    data: {
      follower_id: followerId,
      following_id: followingId,
    },
  });
};

export const deleteFollowRecord = async (followerId: string, followingId: string) => {
  return prisma.following.delete({
    where: {
      following_id_follower_id: {
        following_id: followingId,
        follower_id: followerId,
      },
    },
  });
};

export const findFollowRecord = async (followerId: string, followingId: string) => {
  return prisma.following.findUnique({
    where: {
      following_id_follower_id: {
        following_id: followingId,
        follower_id: followerId,
      },
    },
  });
};

export const findUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });
};
