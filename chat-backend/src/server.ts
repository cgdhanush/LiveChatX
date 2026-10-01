import express, { type Express } from "express";
import cros from "cors";
import connectDB from "./db.ts";
import messageRouter from "./routes/message.routes.ts";
import userRouter from "./routes/user.routes.ts";

import { config } from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { auth } from "./auth.ts";

config();
connectDB();

const app = express();
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use(cros());
app.use(express.json());
app.use(auth);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);

httpServer.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
