import Scanner from './Scanner';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

class Lox {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({ input, output });
  }

  async runPrompt() {
    throw Error('Not implimented');
  }

  run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanForTokens();
    return tokens;
  }
}

export default Lox;
