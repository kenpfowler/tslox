import TokenType from "./TokenType";
import Token from "./Token";

class Lox {
  PrintTokenTypes() {
    const token = new Token("/", TokenType.SLASH, "/", 1);
    console.log(token.toString());
  }
}

const tlox = new Lox();
tlox.PrintTokenTypes();
