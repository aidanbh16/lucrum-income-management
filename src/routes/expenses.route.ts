import { Router } from "express";
import { pool } from "../db/client";
import { env } from "../config/env";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/", async (req, res) => {
    const token = req.cookies.user;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET!) as { userId: string };

        const result = await pool.query(
            "SELECT * FROM expenses WHERE user_id = $1 ORDER BY created_at ASC",
            [decoded.userId]
        );
        return res.json({ expenses: result.rows });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    const token = req.cookies.user;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const { name, amount, type, frequency } = req.body;

    if (!name || amount === undefined || !type) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    if (!["recurring", "variable"].includes(type)) {
        return res.status(400).json({ error: "Invalid type" });
    }
    if (type === "recurring" && !["weekly", "biweekly", "monthly", "annually"].includes(frequency)) {
        return res.status(400).json({ error: "Invalid frequency" });
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET!) as { userId: string };

        const result = await pool.query(
            `INSERT INTO expenses (user_id, name, amount, type, frequency)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [decoded.userId, name, Number(amount), type, type === "recurring" ? frequency : null]
        );
        return res.status(201).json({ expense: result.rows[0] });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
});

router.patch("/:id", async (req, res) => {
    const token = req.cookies.user;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const { name, amount, frequency } = req.body;

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET!) as { userId: string };

        const result = await pool.query(
            `UPDATE expenses
             SET name = COALESCE($1, name),
                 amount = COALESCE($2, amount),
                 frequency = COALESCE($3, frequency)
             WHERE id = $4 AND user_id = $5
             RETURNING *`,
            [name ?? null, amount !== undefined ? Number(amount) : null, frequency ?? null, id, decoded.userId]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
        return res.json({ expense: result.rows[0] });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    const token = req.cookies.user;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET!) as { userId: string };

        const result = await pool.query(
            "DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id",
            [id, decoded.userId]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
        return res.json({ message: "Deleted" });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
});

export default router;
