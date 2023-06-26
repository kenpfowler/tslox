import { Binary, Expression, Grouping, Literal, Unary } from './Expression';
import Lox from './Lox';
import ParseError from './ParseError';
import Token from './Token';
import TokenType from './TokenType';

// TODO: implement parser.  See CH6: https://craftinginterpreters.com/parsing-expressions.html
// in order to understand how to code the parser you need to understand how lox's grammar works.
// the above chapter and a few preceding chapters help you understand this.
// it works much like the scanner in that it takes a list of tokens and then tries to match those to a valid expression in the language

class Parser {
  private readonly tokens: Array<Token>;
  private current = 0;

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
  }

  public parse() {
    try {
      return this.expression();
    } catch (error) {
      return null;
    }
  }

  private expression() {
    return this.equality();
  }

  private equality() {
    let expression = this.comparison();

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator = this.previous();
      const right = this.comparison();
      expression = new Binary(expression, operator, right);
    }

    return expression;
  }

  private previous() {
    return this.tokens[this.current - 1];
  }

  private comparison() {
    let expr = this.term();

    while (
      this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)
    ) {
      const operator = this.previous();
      const right = this.term();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  private term() {
    let expr = this.factor();

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator = this.previous();
      const right = this.factor();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  private factor() {
    let expr = this.unary();

    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator = this.previous();
      const right = this.unary();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  private unary(): Expression {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      const operator = this.previous();
      const right = this.unary();
      return new Unary(operator, right);
    }

    return this.primary();
  }

  private primary() {
    if (this.match(TokenType.FALSE)) return new Literal(false);
    if (this.match(TokenType.TRUE)) return new Literal(true);
    if (this.match(TokenType.NIL)) return new Literal(null);

    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Literal(this.previous().literal);
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
      return new Grouping(expr);
    }

    throw new Error(`${this.peek()}, Expect expression.`);
  }

  private consume(type: TokenType, message: string) {
    if (this.check(type)) return this.advance();

    throw new Error(message);
  }

  private error(token: Token, message: string) {
    Lox.error(token, message);
    return new ParseError();
  }

  private check(type: TokenType) {
    if (this.isAtEnd()) return false;
    return this.peek().type == type;
  }

  private peek() {
    return this.tokens[this.current];
  }

  private isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  private advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private match(...types: TokenType[]) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }
}
export default Parser;
