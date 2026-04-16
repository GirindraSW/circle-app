import { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../middlewares/auth.middleware.js";
import { followUser, getFollowsByType, unfollowUser } from "./follow.service.js";
import type { FollowListType } from "./follow.type.js";

export const getFollows = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const currentUserId = authReq.user?.user_id;
  const rawType = req.query.type;
  const type = rawType === "following" ? "following" : "followers";

  if (!currentUserId) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }

  try {
    const follows = await getFollowsByType(currentUserId, type as FollowListType);
    return res.status(200).json({
      status: "success",
      data: {
        [type]: follows,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: `Failed to fetch ${type} data. Please try again later.`,
    });
  }
};

export const postFollow = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const currentUserId = authReq.user?.user_id;
  const body = req.body as { followed_user_id?: string; followed_id?: string };
  const followedUserId = body.followed_user_id || body.followed_id || "";

  if (!currentUserId) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }

  if (!followedUserId) {
    return res.status(400).json({
      status: "error",
      message: "followed_user_id is required.",
    });
  }

  try {
    const result = await followUser(currentUserId, followedUserId);
    return res.status(200).json({
      status: "success",
      message: "You have successfully followed the user.",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to follow the user. Please try again later.",
    });
  }
};

export const deleteFollow = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const currentUserId = authReq.user?.user_id;
  const body = req.body as { followed_user_id?: string; followed_id?: string };
  const followedUserId = body.followed_user_id || body.followed_id || "";

  if (!currentUserId) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }

  if (!followedUserId) {
    return res.status(400).json({
      status: "error",
      message: "followed_id is required.",
    });
  }

  try {
    const result = await unfollowUser(currentUserId, followedUserId);
    return res.status(200).json({
      status: "success",
      message: "You have successfully unfollowed the user.",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to unfollow the user. Please try again later.",
    });
  }
};
