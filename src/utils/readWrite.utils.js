import { FILE_PATH } from "./constants.js";
import fs from "fs/promises";
const readDataFile = async () => {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data file:", error);
    throw error;
  }
};

const writeDataFile = async (data) => {
  try {
    await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing data file:", error);
    throw error;
  }
};

export { readDataFile, writeDataFile };
