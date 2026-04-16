import "dotenv/config";
import { createServer } from "node:http";
import path from "node:path";
import express, { Request, Response } from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import authRouter from "./routes/auth.routes.js";
import { prisma } from "./lib/prisma.js";
import { likeRouter, replyRouter, threadRouter } from "./modules/thread/thread.route.js";
import { startThreadQueueWorker } from "./queue/thread.queue.js";
import { initWebSocket } from "./realtime/ws.js";

const app = express();
const PORT = Number(process.env.PORT || 5000);
const server = createServer(app);
const wsServer = new WebSocketServer({ server, path: "/ws" });

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/threads", threadRouter);
app.use("/api/v1/thread", threadRouter);
app.use("/api/v1/reply", replyRouter);
app.use("/api/v1/like", likeRouter);

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

initWebSocket(wsServer);
startThreadQueueWorker();

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
