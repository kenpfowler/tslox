import Lox from './Lox';
import Token, { ITokenType } from './Token';
import TokenType from './TokenType';

class Scanner {
  // a scanner will take in a file and process it into tokens...
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

  private addToken(props: ITokenType) {
    const token = new Token(props);
    this.tokens.push(token);
  }

  // search the source code for lexemes that can be represented as tokens
  public scanForTokens() {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token({ type: TokenType.EOF, line: this.line }));
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
    this.addToken({
      type: TokenType.STRING,
      lexeme: string,
      line: this.line,
      literal: new String(string),
    });
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

    this.addToken({
      type: TokenType.NUMBER,
      lexeme: this.getLexeme(),
      literal: new Number(this.getLexeme()),
      line: this.line,
    });
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

    this.addToken({
      type,
      line: this.line,
      lexeme: this.getLexeme(),
    });
  }

  private isAlpha(char: string) {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char == '_';
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

  private scanToken() {
    const char = this.advance();

    switch (char) {
      case TokenType.LEFT_PAREN:
        this.addToken({
          type: TokenType.LEFT_PAREN,
          line: this.line,
          lexeme: this.getLexeme(),
        });
        break;
      case TokenType.RIGHT_PAREN:
        this.addToken({ type: TokenType.RIGHT_PAREN, line: this.line, lexeme: this.getLexeme() });
        break;
      case TokenType.LEFT_BRACE:
        this.addToken({ type: TokenType.LEFT_BRACE, line: this.line, lexeme: this.getLexeme() });
        break;
      case TokenType.RIGHT_BRACE:
        this.addToken({ type: TokenType.RIGHT_BRACE, line: this.line, lexeme: this.getLexeme() });
        break;
      case TokenType.COMMA:
        this.addToken({ type: TokenType.COMMA, line: this.line, lexeme: this.getLexeme() });
        break;
      case TokenType.DOT:
        this.addToken({ type: TokenType.DOT, line: this.line, lexeme: this.getLexeme() });
        break;
      case TokenType.MINUS:
        this.addToken({ type: TokenType.MINUS, line: this.line, lexeme: this.getLexeme() });
        break;
      case TokenType.PLUS:
        this.addToken({ type: TokenType.PLUS, line: this.line, lexeme: this.getLexeme() });
        break;
      case TokenType.SEMICOLON:
        this.addToken({ type: TokenType.SEMICOLON, line: this.line, lexeme: this.getLexeme() });
        break;
      case TokenType.STAR:
        this.addToken({ type: TokenType.STAR, line: this.line, lexeme: this.getLexeme() });
        break;
      case TokenType.BANG:
        this.addToken({
          type: this.match('=') ? TokenType.BANG_EQAUL : TokenType.BANG,
          line: this.line,
          lexeme: this.getLexeme(),
        });
        break;
      case TokenType.EQUAL:
        this.addToken({
          type: this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL,
          line: this.line,
          lexeme: this.getLexeme(),
        });
        break;
      case TokenType.GREATER:
        this.addToken({
          type: this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER,
          line: this.line,
          lexeme: this.getLexeme(),
        });
        break;
      case TokenType.LESS:
        this.addToken({
          type: this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS,
          line: this.line,
          lexeme: this.getLexeme(),
        });
        break;
      case TokenType.SLASH:
        if (this.match('/')) {
          while (!this.isAtEnd() && this.peek() !== '\n') {
            this.advance();
          }
        } else {
          this.addToken({ type: TokenType.SLASH, line: this.line, lexeme: this.getLexeme() });
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
