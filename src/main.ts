import Lox from './Lox.ts';

// we want to drop the user into a REPL for our interpreter if there is no file path provided.
async function main() {
  const tooManyArgs = Deno.args.length > 1;
  const filePath = Deno.args.at(0);

  if (tooManyArgs) {
    console.log('Usage: tlox [script]');
    Deno.exit(1);
  }

  // drop the user into REPL if there is no file path provided
  if (!filePath) {
    try {
      await Lox.runPrompt();
      Deno.exit(0);
    } catch (e) {
      console.error(e);
      Deno.exit(0);
    }
  }

  try {
    const decoder = new TextDecoder('utf-8');
    const bytes = await Deno.readFile(filePath);
    const decoded = decoder.decode(bytes);

    console.log(`Running tslox interpreter on file -> ${filePath}:`);
    Lox.run(decoded);
    Deno.exit(0);
  } catch (err) {
    console.error(err);
    console.error(`Error: Unable to read file at path ${filePath}`);
    Deno.exit(1);
  }
}

main();
