import express, { type Express, type Request, type Response } from "express";
import cros from "cors";

const app: Express = express();

app.use(express.json());
app.use(cros());

const messages = ["hii mike", "hello arun", "had lunch ravi"];

app.get("/messages", (req: Request, res: Response) => {
  res.send(messages);
});

app.listen(3000);
