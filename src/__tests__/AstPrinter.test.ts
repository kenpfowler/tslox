import { AstPrinter } from '../AstPrinter';
import { Binary, Unary, Literal, Grouping } from '../Expr';
import Token from '../Token';
import TokenType from '../TokenType';

describe('Test Scanner Implementation: Punctuators', () => {
  const expected = '(* (- 123) (group 45.67))';
  const expression = new Binary(
    new Unary(
      new Token({ type: TokenType.MINUS, lexeme: '-', literal: null, line: 1 }),
      new Literal(123)
    ),
    new Token({ type: TokenType.STAR, lexeme: '*', literal: null, line: 1 }),
    new Grouping(new Literal(45.67))
  );
  const result = new AstPrinter(expression).print();

  it(`It should return expected printed ast`, () => {
    expect(result).toBe(expected);
  });
});
