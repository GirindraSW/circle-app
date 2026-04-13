import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware.js";
import { getThreadList } from "./thread.service.js";

export const getThreads = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const currentUserId = authReq.user?.user_id;
    const threads = await getThreadList(currentUserId);

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Threads fetched successfully.",
      data: threads,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Failed to fetch threads.",
    });
  }
};
