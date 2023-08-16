import exp from 'constants';
import {
  Binary,
  Expr,
  Grouping,
  Literal,
  Unary,
  ExprVisitor,
  Variable,
  Assign,
  Logical,
  Call,
} from './Expr';
import {
  Block,
  ExpressionStatement,
  Func,
  If,
  Print,
  Return,
  StmtVisitor,
  Var,
  While,
} from './Stmt';

export class AstPrinter implements ExprVisitor<string>, StmtVisitor<string> {
  expr: Expr;

  constructor(expr: Expr) {
    this.expr = expr;
  }
  visitReturnStmt(stmt: Return) {
    return '';
  }
  visitFuncStmt(stmt: Func) {
    return '';
  }
  visitFunctionStmt(stmt: Function) {
    return '';
  }
  visitWhileStmt(stmt: While) {
    return '';
  }
  visitIfStmt(stmt: If) {
    return '';
  }
  visitBlockStmt(stmt: Block) {
    return '';
  }
  visitExpressionStatementStmt(stmt: ExpressionStatement) {
    return '';
  }
  visitPrintStmt(stmt: Print) {
    return '';
  }

  visitVarStmt(stmt: Var) {
    return '';
  }

  visitCallExpr(expr: Call) {
    return this.parenthesize('call', ...expr.args);
  }
  visitLogicalExpr(expr: Logical) {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

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
