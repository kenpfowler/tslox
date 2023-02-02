import TokenType from "./TokenType";

class Lox {
  PrintTokenTypes() {
    const tokenTypes = [...Object.keys(TokenType)];
    tokenTypes.forEach((type) => {
      console.log(type);
    });
  }
}

const tlox = new Lox();
tlox.PrintTokenTypes();
