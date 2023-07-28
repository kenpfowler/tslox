import Token, { LoxLiteral } from './Token';

/*
These Expression classes are meant to represent our syntax tree structures.
They don't do anything. They are just data structures to represent valid grouping.
What is done with them will be up to the classes that use them.
The Parser will create these trees and the Interpreter class will consume them.
They are bridge for the Parser and Interpreter classes to communicate.
*/

export abstract class Expression {
  abstract accept<R>(visitor: Visitor<R>): R;
}

interface Visitor<R> {
  visitBinaryExpression: (expression: Binary) => R;
  visitGroupingExpression: (expression: Grouping) => R;
  visitLiteralExpression: (expression: Literal) => R;
  visitUnaryExpression: (expression: Unary) => R;
}

export class Binary extends Expression {
  readonly left: Expression;
  readonly operator: Token;
  readonly right: Expression;

  constructor(left: Expression, operator: Token, right: Expression) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  public accept<R>(visitor: Visitor<R>): R {
    return visitor.visitBinaryExpression(this);
  }
}

export class Grouping extends Expression {
  readonly expression: Expression;
  constructor(expression: Expression) {
    super();
    this.expression = expression;
  }

  public accept<R>(visitor: Visitor<R>): R {
    return visitor.visitGroupingExpression(this);
  }
}
export class Unary extends Expression {
  readonly operator: Token;
  readonly right: Expression;
  constructor(token: Token, expression: Expression) {
    super();
    this.operator = token;
    this.right = expression;
  }

  public accept<R>(visitor: Visitor<R>): R {
    return visitor.visitUnaryExpression(this);
  }
}
export class Literal extends Expression {
  // in our java implementation we're using the Object type to represent all lox values.  How can we do this in javascript?
  readonly value: LoxLiteral;
  constructor(value: LoxLiteral) {
    super();
    this.value = value;
  }

  public accept<R>(visitor: Visitor<R>): R {
    return visitor.visitLiteralExpression(this);
  }
}
