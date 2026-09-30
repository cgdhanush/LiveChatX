import { Router, type Request, type Response } from "express";
import { log } from "node:console";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    log(body);
    res.status(200).json({ message: "Good" });
  } catch (error) {
    log(error);
    res.status(500).json({ error: "Failed to get messages" });
  }
});

export default router;
