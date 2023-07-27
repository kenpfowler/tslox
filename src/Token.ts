import TokenType from './TokenType';
export type LoxLiteral = number | object | string | null | boolean | undefined;

export interface ITokenType {
  lexeme?: string;
  literal?: LoxLiteral;
  type: TokenType;
  line: number;
}

class Token {
  readonly lexeme: string | undefined;
  readonly literal: LoxLiteral;
  readonly type: TokenType;
  readonly line: number;

  constructor(args: ITokenType) {
    this.lexeme = args.lexeme ?? undefined;
    this.type = args.type;
    this.literal = args.literal ?? undefined;
    this.line = args.line;
  }

  public toString() {
    return `${this.type} ${this.lexeme} ${this.literal} ${this.line}`;
  }
}

export default Token;
