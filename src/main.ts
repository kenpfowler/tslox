import path from "path";
import fs from "fs";

function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("Error: No file path provided");
    process.exit(1);
  }

  const fullPath = path.resolve(process.cwd(), filePath);

  fs.readFile(fullPath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error: Unable to read file at path ${fullPath}`);
      process.exit(1);
    }

    console.log(`Contents of file at path ${fullPath}:`);
    console.log(data);
  });
}

main();
