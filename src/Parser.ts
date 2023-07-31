import { Binary, Expr, Grouping, Literal, Unary, Variable } from './Expr';
import Lox from './Lox';
import ParseError from './ParseError';
import { ExpressionStatement, Print, Stmt, Var } from './Stmt';
import Token from './Token';
import TokenType from './TokenType';

// TODO: implement parser.  See CH6: https://craftinginterpreters.com/parsing-expressions.html
// in order to understand how to code the parser you need to understand how lox's grammar works.
// the above chapter and a few preceding chapters help you understand this.
// it works much like the scanner in that it takes a list of tokens and then tries to match those to a valid expression in the language

/**
 * program        → declaration* EOF
 * declaration    → classDecl | funDecl | varDecl | statement
 * classDecl      → "class" IDENTIFIER ( "<" IDENTIFIER )? "{" function* "}"
 * funDecl        → "fun" function
 * function       → IDENTIFIER "(" parameters? ")" block
 * parameters     → IDENTIFIER ( "," IDENTIFIER )*
 * varDecl        → "var" IDENTIFIER ( "=" expression )? ";"
 * statement      → exprStmt | forStmt | ifStmt | printStmt | returnStmt | whileStmt | block
 * exprStmt       → expression ";"
 * ifStmt         → "if" "(" expression ")" statement ( "else" statement )?
 * forStmt        → "for" "(" ( varDecl | exprStmt | ";" ) expression? ";" expression? ")" statement
 * printStmt      → "print" expression ";"
 * returnStmt     → "return" expression? ";"
 * whileStmt      → "while" "(" expression ")" statement
 * block          → "{" declaration* "}" ;
 *
 *
 *
 * expression     → assignment
 * assignment     → ( call "." )? IDENTIFIER "=" assignment | logicOr
 * logicOr        → logicAnd ("or" logicAnd)*
 * logicAnd       → equality ("and" equality)*
 * equality       → comparison ( ( "!=" | "==" ) comparison )*
 * comparison     → term ( ( ">" | ">=" | "<" | "<=" ) term )*
 * term           → factor ( ( "-" | "+" ) factor )*
 * factor         → unary ( ( "/" | "*" ) unary )*
 * unary          → ( "!" | "-" ) unary | call
 * call           → primary ( "(" arguments? ")" | "." IDENTIFIER )*
 * arguments      → expression ( "," expression )*
 * primary        → NUMBER | STRING | "true" | "false" | "nil" | "this" | IDENTIFIER | "(" expression ")" | "super" "." IDENTIFIER
 */

class Parser {
  private readonly tokens: Array<Token>;
  private current = 0;

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
  }

  parse() {
    const statements = new Array<Stmt>();
    while (!this.isAtEnd()) {
      statements.push(this.declaration());
    }

    return statements;
  }

  private declaration() {
    try {
      if (this.match(TokenType.VAR)) return this.varDeclaration();

      return this.statement();
    } catch (error) {
      if (error instanceof ParseError) {
        this.synchronize();
        // FIXME: this is a bandaid. Apperently typed java objects can be initialized as null and still be passed around as the type they are labeled as.
        // This doesn't work in typescript.  Our code in parse on line 24 expects the declaration method to return a statement.
        return null as any;
      }
    }
  }

  private varDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, 'Expect variable name.');

    let initializer = null;

    if (this.match(TokenType.EQUAL)) {
      initializer = this.expression();
    }

    this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");

    // FIXME: this is a bandaid. Apperently typed java objects can be initialized as null and still be passed around as the type they are labeled as.
    // This doesn't work in typescript.  Our constructor expects an expression but the value returned is possibly null.
    return new Var(name, initializer as Expr);
  }

  private statement() {
    if (this.match(TokenType.PRINT)) return this.printStatement();
    return this.expressionStatement();
  }

  private printStatement() {
    const value = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
    return new Print(value);
  }

  private expressionStatement() {
    const value = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after expression.");
    return new ExpressionStatement(value);
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

  private unary(): Expr {
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

    if (this.match(TokenType.IDENTIFIER)) {
      return new Variable(this.previous());
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
      return new Grouping(expr);
    }

    // FIXME: this is where the error is thrown if a print stmt is called without argument/expression. can we spy on this?
    throw this.error(this.peek(), 'Expect expression.');
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
    return this.peek().type === type;
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

  private synchronize() {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type == TokenType.SEMICOLON) return;

      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }

      this.advance();
    }
  }
}
export default Parser;
