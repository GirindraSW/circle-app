import api from "@/services/api";
import type { FollowListType, FollowUserItem } from "../types/follow.type";

type FollowListResponse = {
  status: "success" | "error";
  data: {
    followers?: FollowUserItem[];
    following?: FollowUserItem[];
  };
};

type FollowActionResponse = {
  status: "success" | "error";
  message: string;
  data: {
    user_id: string;
    is_following: boolean;
  };
};

export const getFollowsRequest = async (type: FollowListType) => {
  const response = await api.get<FollowListResponse>(`/follows?type=${type}`);
  return response.data;
};

export const followUserRequest = async (followedUserId: string) => {
  const response = await api.post<FollowActionResponse>("/follows", {
    followed_user_id: followedUserId,
  });
  return response.data;
};

export const unfollowUserRequest = async (followedUserId: string) => {
  const response = await api.delete<FollowActionResponse>("/follows", {
    data: {
      followed_id: followedUserId,
    },
  });
  return response.data;
};
