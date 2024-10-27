import { describe } from '@std/testing/bdd';
import { AstPrinter } from '../AstPrinter.ts';
import { Binary, Grouping, Literal, Unary } from '../Expr.ts';
import Token from '../Token.ts';
import TokenType from '../TokenType.ts';
import { assertEquals } from '@std/assert';

describe('expression is printed correctly', () => {
  const expected = '(* (- 123) (group 45.67))';
  const expression = new Binary(
    new Unary(
      new Token({
        type: TokenType.MINUS,
        lexeme: '-',
        literal: null,
        line: 1,
      }),
      new Literal(123),
    ),
    new Token({ type: TokenType.STAR, lexeme: '*', literal: null, line: 1 }),
    new Grouping(new Literal(45.67)),
  );
  const result = new AstPrinter(expression).print();
  assertEquals(result, expected);
});
