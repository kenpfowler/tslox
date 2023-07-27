import Scanner from './Scanner';
import Token from './Token';
import TokenType from './TokenType';
import Parser from './Parser';
import RuntimeError from './RuntimeError';
import Interpreter from './Interpreter';
import { Expression } from './Expression';

class Lox {
  private static readonly interpreter = new Interpreter();
  private static hadError = false;
  private static hadRuntimeError = false;

  static runtimeError(error: RuntimeError) {
    console.error(error.message + '\n[line ' + error.token.line + ']');
    this.hadRuntimeError = true;
  }

  public static async runPrompt() {
    throw Error('Not Implemented');
  }

  static run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanForTokens();
    const parser = new Parser(tokens);
    const tree = parser.parse();
    if (this.hadError) process.exit(65);
    if (this.hadRuntimeError) process.exit(70);

    if (tree) return this.interpreter.interpret(tree);
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
