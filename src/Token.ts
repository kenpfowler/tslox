import TokenType from "./TokenType";

class Token {
  readonly lexeme: string;
  readonly type: TokenType;
  readonly literal: Object;
  readonly line: number;

  constructor(lexeme: string, type: TokenType, literal: Object, line: number) {
    this.lexeme = lexeme;
    this.type = type;
    this.literal = literal;
    this.line = line;
  }

  public toString() {
    return `${this.type} ${this.lexeme} ${this.literal}`;
  }
}

export default Token;
