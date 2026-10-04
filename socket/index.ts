import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import { db } from "../lib/db";
import { redis, pubClient, subClient } from "../lib/redis";
import { createAdapter } from "@socket.io/redis-adapter";

console.log("DATABASE_URL loaded:", !!process.env.DATABASE_URL);

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.adapter(createAdapter(pubClient, subClient));

io.use((socket, next) => {
  const auth = socket.handshake.auth as {
    userId?: string;
    userName?: string;
  };

  if (!auth.userId) {
    return next(new Error("Unauthorized"));
  }

  socket.data.userId = auth.userId;
  socket.data.userName = auth.userName ?? "Unknown";

  next();
});

io.on("connection", (socket) => {
  console.log(
    `Connected: ${socket.data.userName} (${socket.data.userId})`
  );

  // Presence
  redis
    .set(`presence:${socket.data.userId}`, "online", "EX", 60)
    .then(() => {
      io.emit("user-online", {
        userId: socket.data.userId,
        name: socket.data.userName,
      });
    });

  socket.on("join-room", (roomId: string) => {
    socket.join(roomId);
    console.log(`${socket.data.userName} joined room ${roomId}`);
  });

  socket.on("leave-room", (roomId: string) => {
    socket.leave(roomId);
  });

  // Typing Start
  socket.on("typing-start", ({ roomId }: { roomId: string }) => {
    socket.to(roomId).emit("user-typing", {
      userId: socket.data.userId,
      name: socket.data.userName,
    });
  });

  // Typing Stop
  socket.on("typing-stop", ({ roomId }: { roomId: string }) => {
    socket.to(roomId).emit("user-stop-typing", {
      userId: socket.data.userId,
    });
  });

  socket.on(
    "send-message",
    async ({ roomId, message }: { roomId: string; message: string }) => {
      try {
        if (!message.trim()) return;

        const member = await db.roomMember.findUnique({
          where: {
            userId_roomId: {
              userId: socket.data.userId,
              roomId,
            },
          },
        });

        if (!member) {
          socket.emit("error-message", "Not a member");
          return;
        }

        const saved = await db.message.create({
          data: {
            content: message.trim(),
            roomId,
            userId: socket.data.userId,
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        io.to(roomId).emit("receive-message", saved);
      } catch (err) {
        console.error(err);
      }
    }
  );

  socket.on("disconnect", (reason) => {
    redis.del(`presence:${socket.data.userId}`);

    io.emit("user-offline", {
      userId: socket.data.userId,
    });

    console.log(
      `Disconnected: ${socket.data.userName} | ${reason}`
    );
  });
});

const PORT = Number(process.env.SOCKET_PORT) || 4000;

httpServer.listen(PORT, () => {
  console.log(`Socket server running on :${PORT}`);
});