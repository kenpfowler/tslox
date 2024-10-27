import Lox from './Lox.ts';
import Token, { LoxLiteral } from './Token.ts';
import TokenType from './TokenType.ts';

/**
 * Attempts to process a source file into tokens
 */
class Scanner {
  private tokens: Array<Token> = [];
  private source: string;
  private start = 0;
  private current = 0;
  private line = 1;
  private keywords: Map<string, TokenType> = new Map([
    ['and', TokenType.AND],
    ['class', TokenType.CLASS],
    ['else', TokenType.ELSE],
    ['false', TokenType.FALSE],
    ['fun', TokenType.FUN],
    ['for', TokenType.FOR],
    ['if', TokenType.IF],
    ['nil', TokenType.NIL],
    ['or', TokenType.OR],
    ['print', TokenType.PRINT],
    ['return', TokenType.RETURN],
    ['super', TokenType.SUPER],
    ['this', TokenType.THIS],
    ['true', TokenType.TRUE],
    ['var', TokenType.VAR],
    ['while', TokenType.WHILE],
  ]);

  // instantiate the scanner with the source code
  constructor(source: string) {
    this.source = source;
  }

  private isAtEnd() {
    return this.current >= this.source.length;
  }

  private addToken(
    type: TokenType,
    lexeme: string,
    line: number,
    literal?: LoxLiteral,
  ) {
    const token = new Token({ type, lexeme, line, literal: literal ?? null });
    this.tokens.push(token);
  }

  // search the source code for lexemes that can be represented as tokens
  public scanForTokens() {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(
      new Token({
        type: TokenType.EOF,
        line: this.line,
        lexeme: 'EOF',
        literal: null,
      }),
    );
    return this.tokens;
  }

  private advance() {
    return this.source.charAt(this.current++);
  }

  private match(expected: string) {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) !== expected) return false;

    this.current++;
    return true;
  }

  private peek() {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }

  private string() {
    while (!this.isAtEnd() && this.peek() !== '"') {
      if (this.peek() === '\n') {
        this.line++;
      }
      this.advance();
    }

    if (this.isAtEnd()) {
      Lox.reportError(this.line, 'Unterminated String');
    }

    this.advance();

    const string = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, string, this.line, String(string));
  }

  private isDigit(char: string) {
    return char >= '0' && char <= '9';
  }

  private number() {
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    // Look for a fractional part.
    if (this.peek() == '.' && this.isDigit(this.peekNext())) {
      // Consume the "."
      this.advance();

      while (this.isDigit(this.peek())) this.advance();
    }

    this.addToken(
      TokenType.NUMBER,
      this.getLexeme(),
      this.line,
      Number(this.getLexeme()),
    );
  }

  private identifier() {
    // an identifier can be a keyword or a variable name...
    // if we passed
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }

    const text = this.getLexeme();
    let type = this.keywords.get(text);
    if (!type) type = TokenType.IDENTIFIER;

    this.addToken(type, this.getLexeme(), this.line);
  }

  private isAlpha(char: string) {
    return (
      (char >= 'a' && char <= 'z') ||
      (char >= 'A' && char <= 'Z') ||
      char == '_'
    );
  }

  private isAlphaNumeric(char: string) {
    return this.isAlpha(char) || this.isDigit(char);
  }

  private peekNext() {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current + 1);
  }

  private getLexeme() {
    return this.source.substring(this.start, this.current);
  }

  private commentBlock() {
    while (!this.isAtEnd()) {
      if (this.peek() === '*' && this.peekNext() === '/') {
        break;
      }

      if (this.peek() == '\n') {
        this.line++;
      }

      this.advance();
    }

    if (this.isAtEnd()) {
      Lox.reportError(this.line, 'Unterminated Comment Block');
    }

    this.current = this.current + 2;
  }

  private comment() {
    while (!this.isAtEnd() && this.peek() !== '\n') {
      this.advance();
    }
  }

  private scanToken() {
    const char = this.advance();

    switch (char) {
      case TokenType.LEFT_PAREN:
        this.addToken(TokenType.LEFT_PAREN, this.getLexeme(), this.line);
        break;
      case TokenType.RIGHT_PAREN:
        this.addToken(TokenType.RIGHT_PAREN, this.getLexeme(), this.line);
        break;
      case TokenType.LEFT_BRACE:
        this.addToken(TokenType.LEFT_BRACE, this.getLexeme(), this.line);
        break;
      case TokenType.RIGHT_BRACE:
        this.addToken(TokenType.RIGHT_BRACE, this.getLexeme(), this.line);
        break;
      case TokenType.COMMA:
        this.addToken(TokenType.COMMA, this.getLexeme(), this.line);
        break;
      case TokenType.DOT:
        this.addToken(TokenType.DOT, this.getLexeme(), this.line);
        break;
      case TokenType.MINUS:
        this.addToken(TokenType.MINUS, this.getLexeme(), this.line);
        break;
      case TokenType.PLUS:
        this.addToken(TokenType.PLUS, this.getLexeme(), this.line);
        break;
      case TokenType.SEMICOLON:
        this.addToken(TokenType.SEMICOLON, this.getLexeme(), this.line);
        break;
      case TokenType.STAR:
        this.addToken(TokenType.STAR, this.getLexeme(), this.line);
        break;
      case TokenType.BANG:
        this.addToken(
          this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG,
          this.getLexeme(),
          this.line,
        );
        break;
      case TokenType.EQUAL:
        this.addToken(
          this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL,
          this.getLexeme(),
          this.line,
        );
        break;
      case TokenType.GREATER:
        this.addToken(
          this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER,
          this.getLexeme(),
          this.line,
        );
        break;
      case TokenType.LESS:
        this.addToken(
          this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS,
          this.getLexeme(),
          this.line,
        );
        break;
      case TokenType.SLASH:
        if (this.match('/')) {
          this.comment();
        } else if (this.match('*')) {
          this.commentBlock();
        } else {
          this.addToken(TokenType.SLASH, this.getLexeme(), this.line);
        }
        break;
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace.
        break;
      case '\n':
        this.line++;
        break;
      case '"':
        this.string();
        break;
      default:
        if (this.isDigit(char)) {
          this.number();
        } else if (this.isAlpha(char)) {
          this.identifier();
        } else {
          Lox.reportError(this.line, 'Unexpected Character');
        }
    }
  }
}

export default Scanner;
