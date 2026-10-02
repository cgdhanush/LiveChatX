import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { createServer } from "http";

import { initializeSocket } from "./socket.ts";
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
const io = initializeSocket(httpServer);

// Socket authentication
io.use((socket, next) => {
  console.log("Socket authentication attempt");

  const token = socket.handshake.auth.token;

  console.log("Token exists:", !!token);

  if (!token) {
    console.log("NO TOKEN");
    return next(new Error("Authentication required"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    console.log("JWT decoded:", decoded);

    if (typeof decoded === "string" || !decoded.id) {
      console.log("INVALID JWT PAYLOAD");
      return next(new Error("Invalid token"));
    }

    socket.data.userId = decoded.id;

    console.log("Socket authentication successful");

    next();
  } catch (error) {
    console.error("JWT ERROR:", error);
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

httpServer.listen(3000, "0.0.0.0", () => {
  console.log("Server running on http://localhost:3000");
});
