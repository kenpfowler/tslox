import TokenType from "./TokenType";

class Lox {
  PrintTokenTypes() {
    const tokenTypes = [TokenType.MINUS, TokenType.PLUS];
    tokenTypes.forEach((type) => {
      console.log(type);
    });
  }
}

const tlox = new Lox();
tlox.PrintTokenTypes();
