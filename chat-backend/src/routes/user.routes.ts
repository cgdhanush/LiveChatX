import { Router, type Request, type Response } from "express";
import { log } from "node:console";
import User from "../models/User.ts";

type SignupUser = {
  fullname: string;
  email: string;
  password: string;
};

type LoginUser = {
  email: string;
  password: string;
};

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const body: SignupUser = req.body;
    const createdUser = await User.create(body);
    res.status(200).json({ message: "Created User", user: createdUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to create User", error });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginUser = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    if (existingUser.password !== password) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: existingUser._id,
        fullname: existingUser.fullname,
        email: existingUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get messages" });
  }
});

export default router;
