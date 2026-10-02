import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

export let io: Server;

export const initializeSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  return io;
};
