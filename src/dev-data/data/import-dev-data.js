import envVars from "../../../config/serverConfig.js";
import { readFile } from "fs/promises"; // Note: Using fs/promises for async file operations
import { dirname } from "path";
import { fileURLToPath } from "url";
import connectDB from "../../db/connection.db.js";
import { app } from "../../app.js";
import { Tour } from "../../model/tour.model.js";
import { DB_NAME } from "../../utils/constants.js";
// Use import.meta.url to get the current module's URL
const __filename = fileURLToPath(import.meta.url);
// Use dirname to get the directory name
const __dirname = dirname(__filename);

const main = async () => {
  const connectionString = `${envVars.MONGODB_URI}/${DB_NAME}`;
  try {
    await connectDB(connectionString);
    app.listen(3001, () =>
      console.log(`listening on PORT: ${envVars.PORT || 5000}`)
    );
  } catch (err) {
    console.error("MongoDB Connection failed", err);
  }
};

const tours = await new Promise(async (resolve, reject) => {
  try {
    const data = await readFile(`${__dirname}/tours.json`, "utf-8");
    resolve(JSON.parse(data));
  } catch (err) {
    reject(err);
  }
});

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.error(err);
    throw err;
  }
};

if (process.argv[2] === "--import") {
  importData()
    .then(() => process.exit())
    .catch((err) => console.log(err));
} else if (process.argv[2] === "--delete") {
  deleteData()
    .then(() => process.exit())
    .catch((err) => console.log(err));
} else {
  console.log("inside process.argv error else block");
}

main().catch((err) => console.log(err));
