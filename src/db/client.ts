import { Pool } from "pg";
import { env } from "../config/env";

export const pool = new Pool({
  connectionString: env.DEV_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});