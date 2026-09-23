import express, { type Express } from "express";
import cros from "cors";
import connectDB from "./db.ts";
import messageRouter from "./routes/message.routes.ts";

import { config } from "dotenv";

config();
connectDB();

const app: Express = express();

app.use(cros());
app.use(express.json());
app.use("/api", messageRouter);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
