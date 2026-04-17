import { findFollowingIdsForUsers, searchUsersByQuery } from "./user.repository.js";
import type { SearchUserItem } from "./user.type.js";

export const searchUsers = async (
  currentUserId: string,
  query: string,
): Promise<SearchUserItem[]> => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  const users = await searchUsersByQuery(currentUserId, trimmedQuery);
  const followingIds = await findFollowingIdsForUsers(
    currentUserId,
    users.map((item) => item.id),
  );
  const followingSet = new Set(followingIds.map((item) => item.following_id));

  return users.map((item) => ({
    id: item.id,
    username: item.username,
    name: item.full_name,
    avatar: item.photo_profile,
    is_following: followingSet.has(item.id),
  }));
};

