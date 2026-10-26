import { createServer } from "http";
import { Server } from "socket.io";
import { verifyToken } from "@/lib/utils/auth";

const PORT = Number(process.env.SOCKET_PORT || 3001);

export function startSocketServer() {
  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.APP_BASE_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const serviceSecret = socket.handshake.auth?.serviceSecret;
    if (serviceSecret && serviceSecret === process.env.SOCKET_SERVICE_SECRET) {
      socket.data.isService = true;
      return next();
    }

    const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.replace("Bearer ", "");
    if (!token) return next(new Error("Unauthorized"));

    try {
      const decoded = verifyToken(token);
      socket.data.userId = decoded.userId;
      return next();
    } catch {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    if (socket.data.isService) {
      socket.on("notification:new", ({ userId, notification }) => {
        if (!userId || !notification) return;
        io.to(`user:${userId}`).emit("notification:new", notification);
      });

      socket.on("notification:bulk", ({ userIds, notification }) => {
        if (!Array.isArray(userIds) || !notification) return;
        for (const userId of userIds) {
          io.to(`user:${userId}`).emit("notification:new", notification);
        }
      });

      return;
    }

    const userId = socket.data.userId as string | undefined;
    if (userId) {
      socket.join(`user:${userId}`);
    }

    socket.on("notification:join", (roomUserId: string) => {
      socket.join(`user:${roomUserId}`);
    });

    socket.on("disconnect", () => {
      // No-op. Rooms are cleaned up by Socket.io.
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`Medha Socket.io server running on http://localhost:${PORT}`);
  });

  return io;
}

if (require.main === module) {
  startSocketServer();
}