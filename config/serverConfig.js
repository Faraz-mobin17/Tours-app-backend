import dotenv from "dotenv";

export function loadEnv() {
  const result = dotenv.config();

  if (result?.error) {
    throw new Error("failed to load dotenv");
  }
  console.log("dot env loaded successfully");
}
loadEnv();

export const env = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/",
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "90d",
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN || "90",
  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT || 25,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || "Faraz",
  EMAIL_FROM: process.env.EMAIL_FROM,
  ORIGIN: process.env.ORIGIN,
};
