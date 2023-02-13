import Scanner from '../Scanner';
import TokenType from '../TokenType';
import Token from '../Token';

describe('Test Scanner Implimentation: Punctuators', () => {
  let current = 0;
  const source = '(){};,+-*!===<=>=!=<>/.';
  const scanner = new Scanner(source);
  const tokens = scanner.scanForTokens();
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
    TokenType.BANG_EQAUL,
    TokenType.EQUAL_EQUAL,
    TokenType.LESS_EQUAL,
    TokenType.GREATER_EQUAL,
    TokenType.BANG_EQAUL,
    TokenType.LESS,
    TokenType.GREATER,
    TokenType.SLASH,
    TokenType.DOT,
    TokenType.EOF,
  ];
  const total = expected.length;

  it(`It should return ${total} tokens`, () => {
    expect(tokens.length).toBe(total);
  });

  test.each<Token>(tokens)('Token should be identified as: $type', ({ type }) => {
    expect(type).toBe(expected[current]);
    current++;
  });
});

describe('Test Scanner Implimentation: Keywords', () => {
  let current = 0;
  const source = 'and class else false for fun if nil or return super this true var while';
  const scanner = new Scanner(source);
  const tokens = scanner.scanForTokens();
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
  const total = expected.length;

  it(`It should return ${total} tokens`, () => {
    expect(tokens.length).toBe(total);
  });

  test.each<Token>(tokens)('Token should be identified as: $type', ({ type }) => {
    expect(type).toBe(expected[current]);
    current++;
  });
});

describe('Test Scanner Implimentation: Identifiers', () => {
  let current = 0;
  const source =
    'andy formless fo _ _123 _abc ab123 abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_';
  const scanner = new Scanner(source);
  const tokens = scanner.scanForTokens();
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
  const total = expected.length;

  it(`It should return ${total} tokens`, () => {
    expect(tokens.length).toBe(total);
  });

  test.each<Token>(tokens)('Token should be identified as: $type', ({ type }) => {
    expect(type).toBe(expected[current]);
    current++;
  });
});

describe('Test Scanner Implimentation: Strings', () => {
  let current = 0;
  const source = '"""string"';
  const scanner = new Scanner(source);
  const tokens = scanner.scanForTokens();
  const expected = [TokenType.STRING, TokenType.STRING, TokenType.EOF];
  const total = expected.length;

  it(`It should return ${total} tokens`, () => {
    expect(tokens.length).toBe(total);
  });

  test.each<Token>(tokens)('Token should be identified as: $type', ({ type }) => {
    expect(type).toBe(expected[current]);
    current++;
  });
});

describe('Test Scanner Implimentation: Numbers', () => {
  let current = 0;
  const source = '123 123.456 .456 123.';
  const scanner = new Scanner(source);
  const tokens = scanner.scanForTokens();
  const expected = [
    TokenType.NUMBER,
    TokenType.NUMBER,
    TokenType.DOT,
    TokenType.NUMBER,
    TokenType.NUMBER,
    TokenType.DOT,
    TokenType.EOF,
  ];
  const total = expected.length;

  it(`It should return ${total} tokens`, () => {
    expect(tokens.length).toBe(total);
  });

  test.each<Token>(tokens)('Token should be identified as: $type', ({ type }) => {
    expect(type).toBe(expected[current]);
    current++;
  });
});
