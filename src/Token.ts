import TokenType from './TokenType';
export type LoxLiteral = number | string | null | boolean;

export interface ITokenType {
  lexeme: string;
  type: TokenType;
  line: number;
  literal: LoxLiteral;
}

/**
 * Represents a Token that can be processed by the Lox interpreters toolchain
 * @param lexeme text from the source code that can be identified as part of the lox language.  ex: "var" is a lexeme since it declares a variable in our language.
 * @param literal lexemes are sometimes represented by these literal values NUMBER | STRING | "true" | "false" | "nil". A token without a runtime value has a literal value of nil.
 * @param type the type used to represent the lexeme
 * @param line the line in the source code file the token appears
 */
class Token {
  readonly lexeme: string;
  readonly type: TokenType;
  readonly line: number;
  readonly literal: LoxLiteral;

  constructor(args: ITokenType) {
    this.lexeme = args.lexeme;
    this.type = args.type;
    this.line = args.line;
    this.literal = args.literal;
  }

  public toString() {
    return `${this.type} ${this.lexeme} ${this.literal} ${this.line}`;
  }
}

export default Token;
