import { AstPrinter } from '../AstPrinter';
import { Binary, Unary, Literal, Grouping } from '../Expression';
import Token from '../Token';
import TokenType from '../TokenType';

describe('Test Scanner Implimentation: Punctuators', () => {
  const expected = '(* (- 123) (group 45.67))';
  const expression = new Binary(
    new Unary(
      new Token({ type: TokenType.MINUS, lexeme: '-', literal: undefined, line: 1 }),
      new Literal(123)
    ),
    new Token({ type: TokenType.STAR, lexeme: '*', literal: undefined, line: 1 }),
    new Grouping(new Literal(45.67))
  );
  const printer = new AstPrinter(expression).print();

  it(`It should return expected printed ast`, () => {
    expect(printer).toBe(expected);
  });
});
