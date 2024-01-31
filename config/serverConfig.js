import fs from "fs";
import dotenv from "dotenv";
// import * as url from "url";
// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
// console.log(__dirname);
// console.log(__filename);
import { dotenvPath } from "../path.js";
if (fs.existsSync(dotenvPath)) {
  dotenv.config(dotenvPath);
} else {
  console.error(".env file not found");
  process.exit();
}

const envVars = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017",
};

export default envVars;
