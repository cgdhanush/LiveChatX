import { Router, type Request, type Response } from "express";
import Message from "../models/Message.ts";
import { io } from "../server.ts";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error getting messages:", error);

    return res.status(500).json({
      error: "Failed to get messages",
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    const message = await Message.create({
      text: text.trim(),
    });

    io.emit("new-message", message);

    return res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message:", error);

    return res.status(500).json({
      error: "Failed to create message",
    });
  }
});

export default router;
