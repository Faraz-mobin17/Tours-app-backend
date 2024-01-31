import * as url from "url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
console.log(__dirname);
console.log(__filename);

let dotenvPath = `${__dirname}.env`;
dotenvPath = dotenvPath.replace("\\", "/");

console.log(`${__dirname}.env`);
export { dotenvPath };
