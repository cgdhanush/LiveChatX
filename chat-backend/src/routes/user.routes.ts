import { Router, type Request, type Response } from "express";
import User from "../models/User.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    const { fullname, email, password }: SignupUser = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      password: hashedPassword,
    });
    res.status(200).json({ message: "Created User" });
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
        message: "Email not found",
      });
    }
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({
        message: "password did not match",
      });
    }
    const secret = process.env.JWT_SECRET!;
    const token = jwt.sign(
      {
        id: existingUser._id.toString(),
        email: existingUser.email,
      },
      secret,
      {
        expiresIn: "1h",
      },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get messages" });
  }
});

export default router;
