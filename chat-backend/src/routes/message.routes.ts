import { Router, type Request, type Response } from "express";
import { log } from "node:console";
import Message from "../models/Message.ts";
import { io } from "../server.ts";

const router = Router();

//  get messages
router.get("/messages", async (req: Request, res: Response) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    log("Error ", error);
    res.status(500).json({ error: "Failed to get messages" });
  }
});

// store messages
router.post("/message", async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const message = await Message.create({ text });
  io.emit("new-message", message);
  return res.status(201).json(message);
});

export default router;
