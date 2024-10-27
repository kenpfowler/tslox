import { describe, it } from '@std/testing/bdd';
import { assertEquals } from '@std/assert';

import Scanner from '../Scanner.ts';
import TokenType from '../TokenType.ts';

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
    TokenType.GREATER_EQUAL,
    TokenType.BANG_EQUAL,
    TokenType.LESS,
    TokenType.GREATER,
    TokenType.SLASH,
    TokenType.DOT,
    TokenType.EOF,
  ];

  it('should return expected number of tokens', () => {
    assertEquals(tokens.length, expected.length);
  });
  it('should return the correct tokens in sequence', () => {
    assertEquals(
      tokens.map((token) => token.type),
      expected,
    );
  });
});

describe('Test Scanner Implementation: Keywords', () => {
  const source =
    'and class else false for fun if nil or return super this true var while';
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

  it('should return expected number of tokens', () => {
    assertEquals(tokens.length, expected.length);
  });
  it('should return the correct tokens in sequence', () => {
    assertEquals(
      tokens.map((token) => token.type),
      expected,
    );
  });
});

describe('Test Scanner Implementation: Identifiers', () => {
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

  it('should return expected number of tokens', () => {
    assertEquals(tokens.length, expected.length);
  });
  it('should return the correct tokens in sequence', () => {
    assertEquals(
      tokens.map((token) => token.type),
      expected,
    );
  });
});

describe('Test Scanner Implementation: Strings', () => {
  const source = '"""string"';
  const tokens = emitTokens(source);
  const expected = [TokenType.STRING, TokenType.STRING, TokenType.EOF];

  it('should return expected number of tokens', () => {
    assertEquals(tokens.length, expected.length);
  });
  it('should return the correct tokens in sequence', () => {
    assertEquals(
      tokens.map((token) => token.type),
      expected,
    );
  });
});

describe('Test Scanner Implementation: Comments', () => {
  const source = 'abcdefg /* abcdefg */';
  const tokens = emitTokens(source);
  const expected = [TokenType.IDENTIFIER, TokenType.EOF];

  it('should return expected number of tokens', () => {
    assertEquals(tokens.length, expected.length);
  });
  it('should return the correct tokens in sequence', () => {
    assertEquals(
      tokens.map((token) => token.type),
      expected,
    );
  });
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

  it('should return expected number of tokens', () => {
    assertEquals(tokens.length, expected.length);
  });
  it('should return the correct tokens in sequence', () => {
    assertEquals(
      tokens.map((token) => token.type),
      expected,
    );
  });
});
