import { Binary, Expression, Grouping, Literal, Unary, Visitor } from './Expression';

// pass any expression to the AstPrinter => return a print representation of that tree with brackets denoting the nesting.
// ex:
export class AstPrinter implements Visitor<string> {
  expression: Expression;

  constructor(expression: Expression) {
    this.expression = expression;
  }

  visitBinaryExpression(expression: Binary) {
    return this.parenthesize(expression.operator.lexeme ?? '', expression.left, expression.right);
  }

  visitGroupingExpression(expression: Grouping) {
    return this.parenthesize('group', expression.expression);
  }

  visitLiteralExpression(expression: Literal) {
    if (expression.value === null) return 'nil';
    return expression.value?.toString() ?? '';
  }

  visitUnaryExpression(expression: Unary) {
    return this.parenthesize(expression.operator.lexeme ?? '', expression.right);
  }

  parenthesize(name: string, ...expressions: Expression[]) {
    const parenthesized = ['(', name];

    for (const expression of expressions) {
      parenthesized.push(' ');
      parenthesized.push(expression.accept(this));
    }

    parenthesized.push(')');
    return parenthesized.join('');
  }

  print() {
    return this.expression.accept(this);
  }
}
