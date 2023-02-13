import TokenType from '../TokenType';
import Token from '../Token';

describe('Test Token Implimentation', () => {
  it('Should be type: Token', () => {
    expect(
      new Token({ literal: {}, type: TokenType.STRING, lexeme: 'string', line: 0 })
    ).toBeInstanceOf(Token);
  });
});
