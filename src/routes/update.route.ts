import { Router } from "express";
import { pool } from "../db/client";
import { env } from "../config/env";
import jwt from "jsonwebtoken";

const router = Router();

router.patch("/update", async (req, res) => {
  const token = req.cookies.user;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { amount } = req.body;

  if (amount === undefined) {
    return res.status(400).json({ error: "Amount is required" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET!) as { userId: string };

    const result = await pool.query(
      `UPDATE "income-management"
       SET current_balance = $1
       WHERE user_id = $2
       RETURNING current_balance`,
      [amount, decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ balance: result.rows[0].current_balance });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;