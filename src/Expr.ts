import Token, { LoxLiteral } from './Token';

export abstract class Expr {
  abstract accept<R>(visitor: ExprVisitor<R>): R;
}

export interface ExprVisitor<R> {
  visitAssignExpr: (expr: Assign) => R;
  visitLogicalExpr: (expr: Logical) => R;
  visitBinaryExpr: (expr: Binary) => R;
  visitGroupingExpr: (expr: Grouping) => R;
  visitLiteralExpr: (expr: Literal) => R;
  visitUnaryExpr: (expr: Unary) => R;
  visitVariableExpr: (expr: Variable) => R;
}

/**
 * represents a AssignExpr
 */
export class Assign extends Expr {
  readonly name: Token;
  readonly value: Expr;

  constructor(name: Token, value: Expr) {
    super();
    this.name = name;
    this.value = value;
  }
  public accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitAssignExpr(this);
  }
}
/**
 * represents a LogicalExpr
 */
export class Logical extends Expr {
  readonly left: Expr;
  readonly operator: Token;
  readonly right: Expr;

  constructor(left: Expr, operator: Token, right: Expr) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  public accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitLogicalExpr(this);
  }
}
/**
 * represents a BinaryExpr
 */
export class Binary extends Expr {
  readonly left: Expr;
  readonly operator: Token;
  readonly right: Expr;

  constructor(left: Expr, operator: Token, right: Expr) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
  public accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitBinaryExpr(this);
  }
}
/**
 * represents a GroupingExpr
 */
export class Grouping extends Expr {
  readonly expr: Expr;

  constructor(expr: Expr) {
    super();
    this.expr = expr;
  }
  public accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitGroupingExpr(this);
  }
}
/**
 * represents a LiteralExpr
 */
export class Literal extends Expr {
  readonly value: LoxLiteral;

  constructor(value: LoxLiteral) {
    super();
    this.value = value;
  }
  public accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitLiteralExpr(this);
  }
}
/**
 * represents a UnaryExpr
 */
export class Unary extends Expr {
  readonly operator: Token;
  readonly right: Expr;

  constructor(operator: Token, right: Expr) {
    super();
    this.operator = operator;
    this.right = right;
  }
  public accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitUnaryExpr(this);
  }
}
/**
 * represents a VariableExpr
 */
export class Variable extends Expr {
  readonly name: Token;

  constructor(name: Token) {
    super();
    this.name = name;
  }
  public accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitVariableExpr(this);
  }
}
