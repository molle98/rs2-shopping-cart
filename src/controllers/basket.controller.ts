import { Request, Response } from "express";
import { addToBasket } from "../services/basket.service";
import { getBasket } from "../services/basket.service";

export const getBasketController = async (
  req: Request,
  res: Response,
  db: any,
) => {
  try {
    const user = (req as any).user;

    const items = await getBasket(db, user.userId);

    res.json(items);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addToBasketController = async (
  req: Request,
  res: Response,
  db: any,
) => {
  try {
    const { productId, quantity } = req.body;
    const user = (req as any).user;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const result = await addToBasket(db, user.userId, productId, quantity);

    res.json(result);
  } catch (error: any) {
    if (error.message === "Product already added") {
      return res.status(400).json({ message: error.message });
    }

    if (error.message === "Product not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};
