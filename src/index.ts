import express from "express";
import cors from "cors";
import { env } from "./config/env";

import balance from "./routes/balance.route"

const app = express();

const allowedOrigins = (process.env.ALLOWED_FRONTEND_ORIGINS ?? "")
  .split(",")
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
        return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));
app.use(express.json());

app.use("/income", balance)

app.get("/", (req, res) => {
    res.send("Lucrum Income Management System is running");
});
  
app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});