import Scanner from './Scanner';
import Token from './Token';
import TokenType from './TokenType';
import Parser from './Parser';

class Lox {
  private static hadError: boolean = false;

  public static async runPrompt() {
    throw Error('Not Implemented');
  }

  static run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanForTokens();
    const parser = new Parser(tokens);
    const tree = parser.parse();
    return tree;
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
    console.log('[line ' + line + '] Error' + where + ': ' + message);
    this.hadError = true;
  }
}

export default Lox;
