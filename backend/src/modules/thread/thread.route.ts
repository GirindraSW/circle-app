import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { uploadImage } from "../../middlewares/upload.middleware.js";
import {
  putThread,
  removeThread,
  deleteLike,
  getRepliesByThreadId,
  getRepliesByThreadIdQuery,
  getThreadById,
  getThreads,
  postLike,
  postReply,
  postThread,
} from "./thread.controller.js";

const threadRouter = Router();

threadRouter.get("/", authMiddleware, getThreads);
threadRouter.post("/", authMiddleware, uploadImage.single("image"), postThread);
threadRouter.get("/:threadId", authMiddleware, getThreadById);
threadRouter.put("/:threadId", authMiddleware, putThread);
threadRouter.delete("/:threadId", authMiddleware, removeThread);
threadRouter.get("/:threadId/replies", authMiddleware, getRepliesByThreadId);

const replyRouter = Router();
replyRouter.get("/", authMiddleware, getRepliesByThreadIdQuery);
replyRouter.post("/", authMiddleware, uploadImage.single("image"), postReply);

const likeRouter = Router();
likeRouter.post("/", authMiddleware, postLike);
likeRouter.delete("/", authMiddleware, deleteLike);

export { threadRouter, replyRouter, likeRouter };
