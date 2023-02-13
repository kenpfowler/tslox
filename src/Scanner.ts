import Token, { ITokenType } from './Token';
import TokenType from './TokenType';

class Scanner {
  // a scanner will take in a file and process it into tokens...
  private tokens: Array<Token> = [];
  private source: string;
  private start = 0;
  private current = 0;
  private line = 1;

  // instantiate the scanner with the source code
  constructor(source: string) {
    console.log('__SOURCE FILE__', source);
    this.source = source;
  }

  isAtEnd() {
    return this.current >= this.source.length;
  }

  addToken(props: ITokenType) {
    const token = new Token(props);
    this.tokens.push(token);
  }

  // search the source code for lexemes that can be represented as tokens
  scanForTokens() {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token({ type: TokenType.EOF, line: this.line }));
    return this.tokens;
  }

  advance() {
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
    // needs to keep consuming tokens until it finds the closing "
    // the current lexeme is the opening string when we get to this function so lets get the next character
    // then we keep consuming characters until we find the closing string.
    let char = this.advance();
    while (!this.isAtEnd() && char !== '"') {
      if (char === '\n') {
        this.line++;
      }

      char = this.advance();
    }

    const string = this.source.substring(this.start + 1, this.current - 1);
    this.addToken({ type: TokenType.STRING, lexeme: string, line: this.line });
  }

  scanToken() {
    const char = this.advance();
    switch (char) {
      case TokenType.LEFT_PAREN:
        this.addToken({ type: TokenType.LEFT_PAREN, line: this.line });
        break;
      case TokenType.RIGHT_PAREN:
        this.addToken({ type: TokenType.RIGHT_PAREN, line: this.line });
        break;
      case TokenType.LEFT_BRACE:
        this.addToken({ type: TokenType.LEFT_BRACE, line: this.line });
        break;
      case TokenType.RIGHT_BRACE:
        this.addToken({ type: TokenType.RIGHT_BRACE, line: this.line });
        break;
      case TokenType.COMMA:
        this.addToken({ type: TokenType.COMMA, line: this.line });
        break;
      case TokenType.DOT:
        this.addToken({ type: TokenType.DOT, line: this.line });
        break;
      case TokenType.MINUS:
        this.addToken({ type: TokenType.MINUS, line: this.line });
        break;
      case TokenType.PLUS:
        this.addToken({ type: TokenType.PLUS, line: this.line });
        break;
      case TokenType.SEMICOLON:
        this.addToken({ type: TokenType.SEMICOLON, line: this.line });
        break;
      case TokenType.STAR:
        this.addToken({ type: TokenType.STAR, line: this.line });
        break;
      case TokenType.BANG:
        this.addToken({
          type: this.match('=') ? TokenType.BANG_EQAUL : TokenType.BANG,
          line: this.line,
        });
        break;
      case TokenType.EQUAL:
        this.addToken({
          type: this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL,
          line: this.line,
        });
        break;
      case TokenType.GREATER:
        this.addToken({
          type: this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER,
          line: this.line,
        });
        break;
      case TokenType.LESS:
        this.addToken({
          type: this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS,
          line: this.line,
        });
        break;
      case TokenType.SLASH:
        if (this.match('/')) {
          while (!this.isAtEnd() && this.peek() !== '\n') {
            this.advance();
          }
        } else {
          this.addToken({ type: TokenType.SLASH, line: this.line });
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
    }
  }
}

export default Scanner;
