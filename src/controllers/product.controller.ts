import { Request, Response } from "express";
import { getProducts } from "../services/product.service";

export const getProductsController = async (
  req: Request,
  res: Response,
  db: any,
) => {
  try {
    const { name, type } = req.query;

    if (name && !/^[A-Za-z]{1,30}$/.test(name as string)) {
      return res.status(400).json({ message: "Invalid product name" });
    }

    if (type && !["Books", "Music", "Games"].includes(type as string)) {
      return res.status(400).json({ message: "Invalid product type" });
    }

    const products = await getProducts(db, name as string, type as string);

    res.json(products);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};
