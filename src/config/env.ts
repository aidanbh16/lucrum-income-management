import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: process.env.PORT || 8081,
    DEV_DATABASE_URL: process.env.DEV_DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
};