import { Router, type Request, type Response } from "express";
import Message from "../models/Message.ts";
import { io } from "../socket.ts";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
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

    if (typeof text !== "string" || !text.trim()) {
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

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        error: "Message not found",
      });
    }

    io.emit("message-deleted", message._id);

    return res.status(200).json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting message:", error);

    return res.status(500).json({
      error: "Failed to delete message",
    });
  }
});

router.delete("/", async (_req: Request, res: Response) => {
  try {
    await Message.deleteMany({});

    // Notify connected clients
    io.emit("chat-cleared");

    return res.status(200).json({
      message: "Chat cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing chat:", error);

    return res.status(500).json({
      error: "Failed to clear chat",
    });
  }
});

export default router;
