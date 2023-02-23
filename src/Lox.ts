import Scanner from './Scanner';
import { Binary, Grouping, Literal, Unary } from './Expression';
import { AstPrinter } from './AstPrinter';
import Token from './Token';
import TokenType from './TokenType';

class Lox {
  public static async runPrompt() {
    throw Error('Not implimented');
  }

  static run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanForTokens();
    return tokens;
  }

  public static reportError(line: number, message: string) {
    const msg = `[line ${line}] ${message}`;
    throw Error(msg);
  }

  public static prettyPrint() {
    const expression = new Binary(
      new Unary(
        new Token({ type: TokenType.MINUS, lexeme: '-', literal: undefined, line: 1 }),
        new Literal(123)
      ),
      new Token({ type: TokenType.STAR, lexeme: '*', literal: undefined, line: 1 }),
      new Grouping(new Literal(45.67))
    );
    const printer = new AstPrinter(expression).print();
    console.log(printer);
  }
}

export default Lox;
