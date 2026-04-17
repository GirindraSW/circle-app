import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getUserSearch, getUserSuggestions } from "./user.controller.js";

const userRouter = Router();

userRouter.get("/search", authMiddleware, getUserSearch);
userRouter.get("/suggested", authMiddleware, getUserSuggestions);

export default userRouter;
