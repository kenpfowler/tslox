import TokenType from '../TokenType';
import Token from '../Token';
import Scanner from '../Scanner';

describe('Test Scanner Implimentation', () => {
  const scanner = new Scanner('(){};,+-*!===<=>=!=<>/.');
  it('It should return 19 tokens', () => {
    expect(scanner.scanForTokens().length).toBe(19);
  });
});
