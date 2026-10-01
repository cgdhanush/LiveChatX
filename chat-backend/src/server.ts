import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./db.ts";
import messageRouter from "./routes/message.routes.ts";
import userRouter from "./routes/user.routes.ts";
import { auth } from "./auth.ts";
import jwt from "jsonwebtoken";

config();
connectDB();

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

// Public routes
app.use("/api/user", userRouter);

// Protected HTTP routes
app.use(auth);
app.use("/api/message", messageRouter);

// Socket.IO
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// Socket authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication required"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded === "string" || !decoded.id) {
      return next(new Error("Invalid token"));
    }

    socket.data.userId = decoded.id;

    next();
  } catch {
    next(new Error("Invalid or expired token"));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.data.userId);
  console.log("Socket ID:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.data.userId);
  });
});

httpServer.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
