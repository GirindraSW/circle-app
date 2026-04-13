import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getThreads } from "./thread.controller.js";

const threadRouter = Router();

threadRouter.get("/", authMiddleware, getThreads);

export default threadRouter;
