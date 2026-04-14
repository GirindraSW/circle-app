import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { uploadImage } from "../../middlewares/upload.middleware.js";
import {
  getRepliesByThreadId,
  getRepliesByThreadIdQuery,
  getThreadById,
  getThreads,
  postThread,
} from "./thread.controller.js";

const threadRouter = Router();

threadRouter.get("/", authMiddleware, getThreads);
threadRouter.post("/", authMiddleware, uploadImage.single("image"), postThread);
threadRouter.get("/:threadId", authMiddleware, getThreadById);
threadRouter.get("/:threadId/replies", authMiddleware, getRepliesByThreadId);

const replyRouter = Router();
replyRouter.get("/", authMiddleware, getRepliesByThreadIdQuery);

export { threadRouter, replyRouter };
