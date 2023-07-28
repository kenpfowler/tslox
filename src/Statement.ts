import { Expression } from './Expression';

export abstract class Statement {
  abstract accept<R>(visitor: Visitor<R>): R;
}

interface Visitor<R> {
  visitPrintStatement: (statement: PrintStatement) => R;
  visitExpressionStatement: (statement: ExpressionStatement) => R;
}

export class PrintStatement extends Statement {
  readonly expression: Expression;

  constructor(expression: Expression) {
    super();
    this.expression = expression;
  }
  public accept<R>(visitor: Visitor<R>): R {
    return visitor.visitPrintStatement(this);
  }
}

export class ExpressionStatement extends Statement {
  readonly expression: Expression;

  constructor(expression: Expression) {
    super();
    this.expression = expression;
  }

  public accept<R>(visitor: Visitor<R>): R {
    return visitor.visitExpressionStatement(this);
  }
}
