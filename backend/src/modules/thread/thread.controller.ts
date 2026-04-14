import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware.js";
import {
  createThread,
  getThreadDetail,
  getThreadList,
  getThreadReplies,
} from "./thread.service.js";

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

export const postThread = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest & { file?: Express.Multer.File };
  const currentUserId = authReq.user?.user_id;
  const { content } = authReq.body as { content?: string };

  if (!currentUserId) {
    return res.status(401).json({
      code: 401,
      status: "error",
      message: "Unauthorized",
    });
  }

  if (!content || content.trim().length === 0 || content.length > 500) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Invalid thread content.",
    });
  }

  try {
    const thread = await createThread({
      content: content.trim(),
      image: authReq.file?.filename,
      userId: currentUserId,
    });

    return res.status(201).json({
      code: 201,
      status: "success",
      message: "Thread berhasil diposting.",
      data: thread,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Failed to create thread.",
    });
  }
};

export const getThreadById = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const currentUserId = authReq.user?.user_id;
  const threadId = Array.isArray(req.params.threadId)
    ? req.params.threadId[0]
    : req.params.threadId;

  if (!threadId) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "threadId is required",
    });
  }

  try {
    const thread = await getThreadDetail(threadId, currentUserId);

    if (!thread) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Thread not found",
      });
    }

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Data Thread Successfully",
      data: thread,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Failed to fetch thread detail.",
    });
  }
};

export const getRepliesByThreadId = async (req: Request, res: Response) => {
  const threadId = Array.isArray(req.params.threadId)
    ? req.params.threadId[0]
    : req.params.threadId;

  if (!threadId) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "threadId is required",
    });
  }

  try {
    const replies = await getThreadReplies(threadId);

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Data Thread Successfully",
      data: {
        replies,
      },
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Failed to fetch thread replies.",
    });
  }
};

export const getRepliesByThreadIdQuery = async (req: Request, res: Response) => {
  const rawThreadId = Array.isArray(req.query.thread_id)
    ? req.query.thread_id[0]
    : req.query.thread_id;
  const threadId = typeof rawThreadId === "string" ? rawThreadId : "";

  if (!threadId) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "thread_id is required",
    });
  }

  try {
    const replies = await getThreadReplies(threadId);

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Data Thread Successfully",
      data: {
        replies,
      },
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Failed to fetch thread replies.",
    });
  }
};
