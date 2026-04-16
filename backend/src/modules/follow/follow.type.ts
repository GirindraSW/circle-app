export type FollowListItem = {
  id: string;
  username: string;
  name: string;
  avatar: string | null;
  is_following: boolean;
};

export type FollowListType = "followers" | "following";
