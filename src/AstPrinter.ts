import { Binary, Expr, Grouping, Literal, Unary, ExprVisitor, Variable, Assign } from './Expr';

// pass any expression to the AstPrinter => return a print representation of that tree with brackets denoting the nesting.
// ex:
export class AstPrinter implements ExprVisitor<string> {
  expr: Expr;

  constructor(expr: Expr) {
    this.expr = expr;
  }
  // visitExpressionStatement: (statement: Expression) => void;
  // visitPrintStatement: (statement: Print) => void;
  // visitVarStatement: (statement: Var) => void;

  visitVariableExpr(expr: Variable) {
    return this.parenthesize('var', expr);
  }

  visitBinaryExpr(expr: Binary) {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  visitGroupingExpr(expr: Grouping) {
    return this.parenthesize('group', expr.expr);
  }

  visitLiteralExpr(expr: Literal) {
    if (expr.value === null) return 'nil';
    return expr.value?.toString() ?? '';
  }

  visitUnaryExpr(expr: Unary) {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }

  visitAssignExpr(expr: Assign) {
    return this.parenthesize(expr.name.lexeme, expr);
  }

  parenthesize(name: string, ...exprs: Expr[]) {
    const parenthesized = ['(', name];

    for (const expr of exprs) {
      parenthesized.push(' ');
      parenthesized.push(expr.accept(this));
    }

    parenthesized.push(')');
    return parenthesized.join('');
  }

  print() {
    return this.expr.accept(this);
  }
}
