import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getUserSearch } from "./user.controller.js";

const userRouter = Router();

userRouter.get("/search", authMiddleware, getUserSearch);

export default userRouter;

