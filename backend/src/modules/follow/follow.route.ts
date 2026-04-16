import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { deleteFollow, getFollows, postFollow } from "./follow.controller.js";

const followRouter = Router();

followRouter.get("/", authMiddleware, getFollows);
followRouter.post("/", authMiddleware, postFollow);
followRouter.delete("/", authMiddleware, deleteFollow);

export default followRouter;
