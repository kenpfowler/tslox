import Scanner from './Scanner.ts';
import Token from './Token.ts';
import TokenType from './TokenType.ts';
import Parser from './Parser.ts';
import RuntimeError from './RuntimeError.ts';
import Interpreter from './Interpreter.ts';

class Lox {
  private static readonly interpreter = new Interpreter();
  private static hadError = false;
  private static hadRuntimeError = false;

  public static async runPrompt() {
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    // Display the initial prompt
    console.log('type exit or quit to close REPL');
    await Deno.stdout.write(encoder.encode('> '));

    // Loop to continuously read input and execute it
    for await (const chunk of Deno.stdin.readable) {
      const input = decoder.decode(chunk).trim();

      if (input === 'exit' || input === 'quit') {
        console.log('Exiting REPL...');
        break;
      }

      try {
        Lox.run(input);
      } catch (err) {
        console.error('Error:', err);
      }

      // Display the prompt again after executing
      await Deno.stdout.write(encoder.encode('> '));
    }
  }

  static run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanForTokens();
    const parser = new Parser(tokens);
    const statements = parser.parse();

    if (this.hadError) Deno.exit(65);
    if (this.hadRuntimeError) Deno.exit(70);

    this.interpreter.interpret(statements);
  }

  public static error(token: Token, message: string) {
    if (token.type === TokenType.EOF) {
      this.report(token.line, ' at end', message);
    } else {
      this.report(token.line, " at '" + token.lexeme + "'", message);
    }
  }

  public static reportError(line: number, message: string) {
    const msg = `[line ${line}] ${message}`;
    throw Error(msg);
  }

  public static runtimeError(error: RuntimeError) {
    console.error(error.message + '\n[line ' + error.token.line + ']');
    this.hadRuntimeError = true;
  }

  private static report(line: number, where: string, message: string) {
    console.error('[line ' + line + '] Error' + where + ': ' + message);
    this.hadError = true;
  }
}

export default Lox;
