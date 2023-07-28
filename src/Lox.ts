import Scanner from './Scanner';
import Token from './Token';
import TokenType from './TokenType';
import Parser from './Parser';
import RuntimeError from './RuntimeError';
import Interpreter from './Interpreter';
import readline from 'readline';

class Lox {
  private static readonly interpreter = new Interpreter();
  private static hadError = false;
  private static hadRuntimeError = false;

  static runtimeError(error: RuntimeError) {
    console.error(error.message + '\n[line ' + error.token.line + ']');
    this.hadRuntimeError = true;
  }

  public static runPrompt() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.setPrompt('>');
    rl.prompt();
    rl.on('line', (input) => {
      Lox.run(input);
      rl.prompt();
    });
  }

  static run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanForTokens();
    const parser = new Parser(tokens);
    const statements = parser.parse();
    if (this.hadError) process.exit(65);
    if (this.hadRuntimeError) process.exit(70);

    this.interpreter.interpret(statements);
  }

  public static reportError(line: number, message: string) {
    const msg = `[line ${line}] ${message}`;
    throw Error(msg);
  }

  public static error(token: Token, message: string) {
    if (token.type === TokenType.EOF) {
      this.report(token.line, ' at end', message);
    } else {
      this.report(token.line, " at '" + token.lexeme + "'", message);
    }
  }
  private static report(line: number, where: string, message: string) {
    console.error('[line ' + line + '] Error' + where + ': ' + message);
    this.hadError = true;
  }
}

export default Lox;
