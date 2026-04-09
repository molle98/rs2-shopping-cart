import express from "express";
import cors from "cors";
import { initDB } from "./db";
import { loginController } from "./controllers/auth.controller";
import { getProductsController } from "./controllers/product.controller";
import { authMiddleware } from "./middlewares/auth.middleware";
import { addToBasketController } from "./controllers/basket.controller";
import { getBasketController } from "./controllers/basket.controller";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.get("/products", authMiddleware, (req, res) =>
  getProductsController(req, res, req.app.locals.db),
);

app.get("/basket", authMiddleware, (req, res) =>
  getBasketController(req, res, req.app.locals.db),
);

app.post("/login", (req, res) => loginController(req, res, req.app.locals.db));

app.post("/basket", authMiddleware, (req, res) =>
  addToBasketController(req, res, req.app.locals.db),
);

initDB().then((database) => {
  app.locals.db = database;

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
});
