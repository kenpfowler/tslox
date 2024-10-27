import {
  Assign,
  Binary,
  Call,
  Expr,
  Grouping,
  Literal,
  Logical,
  Unary,
  Variable,
} from './Expr.ts';
import Lox from './Lox.ts';
import ParseError from './ParseError.ts';
import {
  Block,
  ExpressionStatement,
  Func,
  If,
  Print,
  Return,
  Stmt,
  Var,
  While,
} from './Stmt.ts';
import Token from './Token.ts';
import TokenType from './TokenType.ts';

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

/**
 * Attempts to match a series of tokens to a corresponding statement and/or expression as per the lox grammar using the recursive descent technique
 */
class Parser {
  private readonly tokens: Array<Token>;
  private current = 0;

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
  }

  /**
   * attempts to parse tokens into a list of statements according to the lox grammar
   * @returns an array of statements
   */
  public parse() {
    const statements = new Array<Stmt>();
    while (!this.isAtEnd()) {
      statements.push(this.declaration());
    }

    return statements;
  }

  /**
   * Attempts to return a declaration or statement → classDecl | funDecl | varDecl | statement
   * @returns
   */
  private declaration() {
    try {
      if (this.match(TokenType.VAR)) return this.varDeclaration();
      if (this.match(TokenType.FUN)) return this.function('function');
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

  private function(kind: string) {
    const name = this.consume(TokenType.IDENTIFIER, 'Expect' + kind + 'name');
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after " + kind + ' name');

    const parameters: Token[] = [];
    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (parameters.length >= 255) {
          throw this.error(this.peek(), "Can't have more than 255 parameters.");
        }

        parameters.push(
          this.consume(TokenType.IDENTIFIER, 'Expect parameter name.'),
        );
      } while (this.match(TokenType.COMMA));
    }
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after parameters.");
    this.consume(TokenType.LEFT_BRACE, "Expect '{' before " + kind + ' body.');
    const body = this.block();

    return new Func(name, parameters, body);
  }

  /**
   * attempts to return a variable declaration
   * varDecl → "var" IDENTIFIER ( "=" expression )? ";"
   * @returns Stmt.Var
   */
  private varDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, 'Expect variable name.');

    let initializer: Expr = new Literal(null);

    if (this.match(TokenType.EQUAL)) {
      initializer = this.expression();
    }

    this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");

    return new Var(name, initializer);
  }

  private statement(): Stmt {
    if (this.match(TokenType.FOR)) return this.for();
    if (this.match(TokenType.WHILE)) return this.while();
    if (this.match(TokenType.PRINT)) return this.printStatement();
    if (this.match(TokenType.RETURN)) return this.returnStatement();
    if (this.match(TokenType.IF)) return this.ifStmt();
    if (this.match(TokenType.LEFT_BRACE)) return new Block(this.block());
    return this.expressionStatement();
  }

  private returnStatement() {
    const keyword = this.previous();
    let value = null;
    if (!this.check(TokenType.SEMICOLON)) {
      value = this.expression();
    }

    this.consume(TokenType.SEMICOLON, "Expect ';' after return value.");
    return new Return(keyword, value);
  }

  private for() {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after while");

    // the next token is not required
    let initializer;
    if (this.match(TokenType.VAR)) {
      initializer = this.varDeclaration();
    } else if (this.match(TokenType.SEMICOLON)) {
      initializer = null;
    } else {
      initializer = this.expressionStatement();
    }

    let condition = null;
    if (!this.check(TokenType.SEMICOLON)) {
      condition = this.expression();
    }

    this.consume(TokenType.SEMICOLON, "Expect ';' after loop condition.");

    let increment = null;
    if (!this.check(TokenType.RIGHT_PAREN)) {
      increment = this.expression();
    }

    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after for clauses.");

    let body = this.statement();
    if (increment !== null) {
      body = new Block([body, new ExpressionStatement(increment)]);
    }

    if (condition === null) {
      condition = new Literal(true);
    }

    body = new While(condition, body);

    if (initializer !== null) {
      body = new Block([initializer, body]);
    }

    return body;
  }

  private while(): While {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after while");
    const expr = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after condition");
    const stmt = this.declaration();

    return new While(expr, stmt);
  }

  private ifStmt(): If {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after if");
    const condition = this.expression();
    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after condition");

    const thenBranch = this.statement();

    let elseBranch = null;
    if (this.match(TokenType.ELSE)) {
      elseBranch = this.statement();
    }

    return new If(condition, thenBranch, elseBranch);
  }

  private block() {
    const statements = new Array<Stmt>();
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      statements.push(this.declaration());
    }

    this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");
    return statements;
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

  /**
   * expression → assignment
   * @returns
   */
  private expression() {
    return this.assignment();
  }

  private assignment() {
    const expr = this.or();

    if (this.match(TokenType.EQUAL)) {
      const equals = this.previous();
      const value: Expr = this.assignment();

      if (expr instanceof Variable) {
        const name = new Variable(expr.name).name; // ((Expr.Variable)expr).name;
        return new Assign(name, value);
      }

      this.error(equals, 'Invalid assignment target.');
    }

    return expr;
  }

  private or() {
    let expr = this.and();

    while (this.match(TokenType.OR)) {
      const operator = this.previous();
      const right = this.and();
      expr = new Logical(expr, operator, right);
    }

    return expr;
  }

  private and() {
    let expr = this.equality();

    while (this.match(TokenType.AND)) {
      const operator = this.previous();
      const right = this.equality();
      expr = new Logical(expr, operator, right);
    }
    return expr;
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

  /**
   * @returns the previous token
   */
  private previous() {
    return this.tokens[this.current - 1];
  }

  private comparison() {
    let expr = this.term();

    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL,
      )
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

    return this.call();
  }

  private call() {
    let expr: Variable | Literal | Grouping | Call = this.primary();

    while (true) {
      if (this.match(TokenType.LEFT_PAREN)) {
        expr = this.finishCall(expr);
      } else {
        break;
      }
    }

    return expr;
  }

  private finishCall(callee: Expr) {
    const args: Expr[] = [];

    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (args.length >= 255) {
          this.error(this.peek(), "Can't have more than 255 arguments.");
        }
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }

    const paren = this.consume(
      TokenType.RIGHT_PAREN,
      "Expect ')' after arguments",
    );

    return new Call(callee, paren, args);
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

  /**
   * expects the current token to match the type and for the parser to advance.
   * if this fails an error will be thrown
   * @param type token type
   * @param message error message to be reported
   * @returns the previous token
   */
  private consume(type: TokenType, message: string) {
    if (this.check(type)) return this.advance();

    throw this.error(this.peek(), message);
  }

  private error(token: Token, message: string) {
    Lox.error(token, message);
    return new ParseError();
  }

  /**
   * @param type a token type
   * @returns return a true if the current token matches the type
   */
  private check(type: TokenType) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  /**
   * @returns the current token being parsed
   */
  private peek() {
    return this.tokens[this.current];
  }

  /**
   * @returns a boolean indicating if we have reached the last token
   */
  private isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  /**
   * moves focus to the next token
   * @returns returns the previous token
   */
  private advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  /**
   * if one of your args matches the current token it moves parsers focus to the next token and returns true
   * else returns false
   * @param types an array of token types
   * @returns
   */
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
