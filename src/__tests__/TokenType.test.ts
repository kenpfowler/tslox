import TokenType from "../TokenType";
import Token from "../Token";

describe("Test Token Implimentation", () => {
  it("Should be type: Token", () => {
    expect(new Token("string", TokenType.STRING, {}, 0)).toBeInstanceOf(Token);
  });
});
