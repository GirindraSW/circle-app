import {
  createFollowRecord,
  deleteFollowRecord,
  findFollowersByUserId,
  findFollowingByUserId,
  findFollowRecord,
  findMutualFollowing,
  findUserById,
} from "./follow.repository.js";
import type { FollowListItem, FollowListType } from "./follow.type.js";

export const getFollowsByType = async (
  currentUserId: string,
  type: FollowListType,
): Promise<FollowListItem[]> => {
  if (type === "followers") {
    const followers = await findFollowersByUserId(currentUserId);
    const followerIds = followers.map((item) => item.follower.id);
    const mutualList = await findMutualFollowing(currentUserId, followerIds);
    const mutualSet = new Set(mutualList.map((item) => item.following_id));

    return followers.map((item) => ({
      id: item.follower.id,
      username: item.follower.username,
      name: item.follower.full_name,
      avatar: item.follower.photo_profile,
      is_following: mutualSet.has(item.follower.id),
    }));
  }

  const following = await findFollowingByUserId(currentUserId);
  return following.map((item) => ({
    id: item.following.id,
    username: item.following.username,
    name: item.following.full_name,
    avatar: item.following.photo_profile,
    is_following: true,
  }));
};

export const followUser = async (currentUserId: string, followedUserId: string) => {
  if (currentUserId === followedUserId) {
    throw new Error("CANNOT_FOLLOW_SELF");
  }

  const targetUser = await findUserById(followedUserId);
  if (!targetUser) {
    throw new Error("USER_NOT_FOUND");
  }

  const existingFollow = await findFollowRecord(currentUserId, followedUserId);
  if (existingFollow) {
    throw new Error("ALREADY_FOLLOWING");
  }

  await createFollowRecord(currentUserId, followedUserId);

  return {
    user_id: followedUserId,
    is_following: true,
  };
};

export const unfollowUser = async (currentUserId: string, followedUserId: string) => {
  const existingFollow = await findFollowRecord(currentUserId, followedUserId);
  if (!existingFollow) {
    throw new Error("NOT_FOLLOWING");
  }

  await deleteFollowRecord(currentUserId, followedUserId);

  return {
    user_id: followedUserId,
    is_following: false,
  };
};
