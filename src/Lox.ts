import Scanner from './Scanner';
import { Grouping, Literal } from './Expression';
import { AstPrinter } from './AstPrinter';

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
    const string = new Literal('my String is inside a grouping');
    const grouping = new Grouping(string);
    const printer = new AstPrinter(grouping).print();
    console.log(printer);
  }
}

export default Lox;
