import path from 'path';
import fs from 'fs';
import Lox from './Lox';

// we want to drop the user into a REPL for our interpreter if there is no file path provided.
function main() {
  const tooManyArgs = process.argv.length > 3;
  const filePath = process.argv[2];

  if (tooManyArgs) {
    console.log('Usage: tlox [script]');
    process.exit(1);
  }

  if (!filePath) {
    try {
      // TODO: figure out how to accept user input so that we can run this as a REPL
      Lox.prettyPrint();
      process.exit(0);
    } catch {
      process.exit(0);
    }
  }

  const fullPath = path.resolve(process.cwd(), filePath);

  fs.readFile(fullPath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error: Unable to read file at path ${fullPath}`);
      process.exit(1);
    }

    console.log(`Running tslox interpreter on file -> ${fullPath}:`);
    console.log(Lox.run(data));
    process.exit(0);
  });
}

main();
