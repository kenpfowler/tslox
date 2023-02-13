import Scanner from '../Scanner';
import TokenType from '../TokenType';

describe('Test Scanner Implimentation', () => {
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

  it('It should return 19 tokens', () => {
    expect(tokens.length).toBe(19);
  });

  test.each(tokens)('Token should be identified as: %s', ({ type }) => {
    expect(type).toBe(expected[current]);
    current++;
  });
});
