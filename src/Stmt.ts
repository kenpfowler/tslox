import { Expr } from './Expr';
import Token from './Token';

export abstract class Stmt {
  abstract accept<R>(visitor: StmtVisitor<R>): R;
}

export interface StmtVisitor<R> {
  visitExpressionStatementStmt: (stmt: ExpressionStatement) => R;
  visitPrintStmt: (stmt: Print) => R;
  visitVarStmt: (stmt: Var) => R;
}

/**
 * represents a ExpressionStatementStmt
 */
export class ExpressionStatement extends Stmt {
  readonly expr: Expr;

  constructor(expr: Expr) {
    super();
    this.expr = expr;
  }
  public accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitExpressionStatementStmt(this);
  }
}
/**
 * represents a PrintStmt
 */
export class Print extends Stmt {
  readonly expression: Expr;

  constructor(expression: Expr) {
    super();
    this.expression = expression;
  }
  public accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitPrintStmt(this);
  }
}
/**
 * represents a VarStmt
 */
export class Var extends Stmt {
  readonly name: Token;
  readonly initializer: Expr;

  constructor(name: Token, initializer: Expr) {
    super();
    this.name = name;
    this.initializer = initializer;
  }
  public accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitVarStmt(this);
  }
}
