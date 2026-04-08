import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import { prisma } from "./lib/prisma.js";

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", authRouter);

app.get("/", async (req: Request, res: Response) => {
  res.json({
    message: "Circle App API is running",
  });
});

app.get("/health", async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", db: "disconnected" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
