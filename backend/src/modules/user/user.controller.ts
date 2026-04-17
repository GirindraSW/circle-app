import { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../middlewares/auth.middleware.js";
import { getSuggestedUsers, searchUsers } from "./user.service.js";

export const getUserSearch = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const currentUserId = authReq.user?.user_id;
  const rawQuery = req.query.q;
  const query = typeof rawQuery === "string" ? rawQuery : "";

  if (!currentUserId) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }

  try {
    const users = await searchUsers(currentUserId, query);
    return res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to search users. Please try again later.",
    });
  }
};

export const getUserSuggestions = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const currentUserId = authReq.user?.user_id;

  if (!currentUserId) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized",
    });
  }

  try {
    const users = await getSuggestedUsers(currentUserId, 5);
    return res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to get suggested users. Please try again later.",
    });
  }
};
