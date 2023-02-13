import Scanner from './Scanner';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

class Lox {
  private rl = readline.createInterface({ input, output });

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
}

export default Lox;
