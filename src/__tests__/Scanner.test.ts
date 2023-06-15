import Scanner from '../Scanner';
import TokenType from '../TokenType';
import Token from '../Token';

function areTokenTypesAccurate(tokens: Token[], expected: TokenType[]) {
  let current = 0;
  test.each<Token>(tokens)('Token should be identified as: $type', ({ type }) => {
    expect(type).toBe(expected[current]);
    current++;
  });
}

function isTokenCountAccurate(tokens: Token[], expected: TokenType[]) {
  const total = expected.length;
  it(`It should return ${total} tokens`, () => {
    expect(tokens.length).toBe(total);
  });
}

function emitTokens(source: string) {
  const scanner = new Scanner(source);
  return scanner.scanForTokens();
}

describe('Test Scanner Implementation: Punctuators', () => {
  const source = '(){};,+-*!===<=>=!=<>/.';
  const tokens = emitTokens(source);
  const expected = [
    TokenType.LEFT_PAREN,
    TokenType.RIGHT_PAREN,
    TokenType.LEFT_BRACE,
    TokenType.RIGHT_BRACE,
    TokenType.SEMICOLON,
    TokenType.COMMA,
    TokenType.PLUS,
    TokenType.MINUS,
    TokenType.STAR,
    TokenType.BANG_EQUAL,
    TokenType.EQUAL_EQUAL,
    TokenType.LESS_EQUAL,
    TokenType.LESS,
    TokenType.GREATER,
    TokenType.SLASH,
    TokenType.DOT,
    TokenType.EOF,
  ];

  isTokenCountAccurate(tokens, expected);
  areTokenTypesAccurate(tokens, expected);
});

describe('Test Scanner Implementation: Keywords', () => {
  const source = 'and class else false for fun if nil or return super this true var while';
  const tokens = emitTokens(source);

  const expected = [
    TokenType.AND,
    TokenType.CLASS,
    TokenType.ELSE,
    TokenType.FALSE,
    TokenType.FOR,
    TokenType.FUN,
    TokenType.IF,
    TokenType.NIL,
    TokenType.OR,
    TokenType.RETURN,
    TokenType.SUPER,
    TokenType.THIS,
    TokenType.TRUE,
    TokenType.VAR,
    TokenType.WHILE,
    TokenType.EOF,
  ];

  isTokenCountAccurate(tokens, expected);
  areTokenTypesAccurate(tokens, expected);
});

describe('Test Scanner Implimentation: Identifiers', () => {
  const source =
    'andy formless fo _ _123 _abc ab123 abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_';
  const tokens = emitTokens(source);

  const expected = [
    TokenType.IDENTIFIER,
    TokenType.IDENTIFIER,
    TokenType.IDENTIFIER,
    TokenType.IDENTIFIER,
    TokenType.IDENTIFIER,
    TokenType.IDENTIFIER,
    TokenType.IDENTIFIER,
    TokenType.IDENTIFIER,
    TokenType.EOF,
  ];

  isTokenCountAccurate(tokens, expected);
  areTokenTypesAccurate(tokens, expected);
});

describe('Test Scanner Implementation: Strings', () => {
  const source = '"""string"';
  const tokens = emitTokens(source);
  const expected = [TokenType.STRING, TokenType.STRING, TokenType.EOF];

  isTokenCountAccurate(tokens, expected);
  areTokenTypesAccurate(tokens, expected);
});

describe('Test Scanner Implementation: Numbers', () => {
  const source = '123 123.456 .456 123.';
  const tokens = emitTokens(source);
  const expected = [
    TokenType.NUMBER,
    TokenType.NUMBER,
    TokenType.DOT,
    TokenType.NUMBER,
    TokenType.NUMBER,
    TokenType.DOT,
    TokenType.EOF,
  ];

  isTokenCountAccurate(tokens, expected);
  areTokenTypesAccurate(tokens, expected);
});
