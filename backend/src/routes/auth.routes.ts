import { Router } from "express";
import { login, me, register, updateMe } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { uploadImage } from "../middlewares/upload.middleware.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authMiddleware, me);
authRouter.patch("/me", authMiddleware, uploadImage.single("avatar"), updateMe);

export default authRouter;
