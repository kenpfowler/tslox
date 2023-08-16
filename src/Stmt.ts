import { Expr } from './Expr';
import Token from './Token';

export abstract class Stmt {
  abstract accept<R>(visitor: StmtVisitor<R>): R;
}

export interface StmtVisitor<R> {
  visitWhileStmt: (stmt: While) => R;
  visitIfStmt: (stmt: If) => R;
  visitBlockStmt: (stmt: Block) => R;
  visitReturnStmt: (stmt: Return) => R;
  visitExpressionStatementStmt: (stmt: ExpressionStatement) => R;
  visitFuncStmt: (stmt: Func) => R;
  visitPrintStmt: (stmt: Print) => R;
  visitVarStmt: (stmt: Var) => R;
}

/**
 * represents a WhileStmt
 */
export class While extends Stmt {
  readonly condition: Expr;
  readonly body: Stmt;

  constructor(condition: Expr, body: Stmt) {
    super();
    this.condition = condition;
    this.body = body;
  }
  public accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitWhileStmt(this);
  }
}
/**
 * represents a IfStmt
 */
export class If extends Stmt {
  readonly condition: Expr;
  readonly thenBranch: Stmt;
  readonly elseBranch: Stmt | null;

  constructor(condition: Expr, thenBranch: Stmt, elseBranch: Stmt | null) {
    super();
    this.condition = condition;
    this.thenBranch = thenBranch;
    this.elseBranch = elseBranch;
  }
  public accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitIfStmt(this);
  }
}
/**
 * represents a BlockStmt
 */
export class Block extends Stmt {
  readonly statements: Array<Stmt>;

  constructor(statements: Array<Stmt>) {
    super();
    this.statements = statements;
  }
  public accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitBlockStmt(this);
  }
}
/**
 * represents a ReturnStmt
 */
export class Return extends Stmt {
  readonly keyword: Token;
  readonly value: Expr | null;

  constructor(keyword: Token, value: Expr | null) {
    super();
    this.keyword = keyword;
    this.value = value;
  }
  public accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitReturnStmt(this);
  }
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
 * represents a FuncStmt
 */
export class Func extends Stmt {
  readonly name: Token;
  readonly params: Array<Token>;
  readonly body: Array<Stmt>;

  constructor(name: Token, params: Array<Token>, body: Array<Stmt>) {
    super();
    this.name = name;
    this.params = params;
    this.body = body;
  }
  public accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitFuncStmt(this);
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
