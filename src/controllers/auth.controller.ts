import { Request, Response } from "express";
import { login } from "../services/auth.service";

export const loginController = async (req: Request, res: Response, db: any) => {
  try {
    const { loginName, password } = req.body;

    if (!loginName || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const token = await login(db, loginName, password);

    res.json({ token });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};
