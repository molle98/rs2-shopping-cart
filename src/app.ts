import express from "express";
import cors from "cors";
import { initDB } from "./db";
import { loginController } from "./controllers/auth.controller";

const app = express();

app.use(cors());
app.use(express.json());

let db: any;

initDB().then((database) => {
  db = database;
});

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.post("/login", (req, res) => loginController(req, res, db));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
