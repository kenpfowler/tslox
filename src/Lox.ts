import TokenType from "./TokenType";

const a = 1;
a = 2;

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
