import { IncomingMessage } from "node:http";
import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import type { JwtUserPayload } from "../middlewares/auth.middleware.js";
import type { ThreadListItem, ThreadReplyItem } from "../modules/thread/thread.type.js";

const clients = new Map<string, WebSocket>();

const getTokenFromRequest = (request: IncomingMessage) => {
  const url = new URL(request.url || "", "http://localhost");
  return url.searchParams.get("token");
};

export const initWebSocket = (wss: WebSocketServer) => {
  wss.on("connection", (ws, request) => {
    const token = getTokenFromRequest(request);
    const jwtSecret = process.env.JWT_SECRET;

    if (!token || !jwtSecret) {
      ws.close();
      return;
    }

    try {
      const payload = jwt.verify(token, jwtSecret) as JwtUserPayload;
      clients.set(payload.user_id, ws);

      ws.on("close", () => {
        clients.delete(payload.user_id);
      });
    } catch (error) {
      ws.close();
    }
  });
};

export const broadcastThreadCreated = (thread: ThreadListItem) => {
  const message = JSON.stringify({
    event: "thread:created",
    data: thread,
  });

  for (const [, client] of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
};

export const broadcastReplyCreated = (payload: {
  threadId: string;
  reply: ThreadReplyItem;
}) => {
  const message = JSON.stringify({
    event: "reply:created",
    data: payload,
  });

  for (const [, client] of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
};
