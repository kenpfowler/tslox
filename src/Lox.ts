import TokenType from "./TokenType";
import Token from "./Token";

class Lox {
  // make it so that I can enter the interpreter by
  // calling the interpreter and being entered into a repl
  // providing one file to the program to run
  //
  PrintTokenTypes() {
    const token = new Token("/", TokenType.SLASH, "/", 1);
    console.log(token.toString());
  }
}

const tlox = new Lox();
tlox.PrintTokenTypes();
