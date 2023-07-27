import { Visitor, Expression, Binary, Unary, Grouping, Literal } from './Expression';
import Lox from './Lox';
import RuntimeError from './RuntimeError';
import { ExpressionStatement, PrintStatement, Statement, StatementVisitor } from './Statement';
import Token, { LoxLiteral } from './Token';
import TokenType from './TokenType';

class Interpreter implements Visitor<LoxLiteral>, StatementVisitor<void> {
  public interpret(statements: Array<Statement>) {
    try {
      for (const statement of statements) {
        this.execute(statement);
      }
    } catch (error) {
      if (error instanceof RuntimeError) Lox.runtimeError(error);
    }
  }

  private stringify(object: LoxLiteral) {
    if (object === undefined) {
      throw Error('cant be undefined');
    }

    if (object === null) return 'nil';

    if (typeof object === 'number') {
      let text = object.toString();
      if (text.endsWith('.0')) {
        text = text.substring(0, text.length - 2);
      }
      return text;
    }

    return object.toString();
  }

  // not sure how to type this
  private evaluate(expression: Expression): LoxLiteral {
    return expression.accept(this);
  }

  private execute(statement: Statement) {
    statement.accept(this);
  }

  private isTruthy(arg: LoxLiteral) {
    if (arg === null) return false;
    if (typeof arg === 'boolean') return arg;
    return true;
  }
  private isEqual(a: LoxLiteral, b: LoxLiteral) {
    // FIXME: since objects are passed by reference this function will not be able to evaluate if they are equal.  This may become a problem.
    // testing strict equality should work for strings, numbers, booleans, null, undefined
    return a === b;
  }

  visitBinaryExpression(expression: Binary) {
    const left = this.evaluate(expression.left);
    const right = this.evaluate(expression.right);

    switch (expression.operator.type) {
      case TokenType.GREATER:
        this.checkNumberOperands(expression.operator, left, right);
        return Number(left) > Number(right);
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(expression.operator, left, right);
        return Number(left) >= Number(right);
      case TokenType.LESS:
        this.checkNumberOperands(expression.operator, left, right);
        return Number(left) < Number(right);
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(expression.operator, left, right);
        return Number(left) <= Number(right);
      case TokenType.MINUS:
        this.checkNumberOperands(expression.operator, left, right);
        return Number(left) - Number(right);
      case TokenType.PLUS:
        if (typeof left === 'number' && typeof right === 'number') {
          return Number(left) + Number(right);
        }

        if (typeof left === 'string' && typeof right === 'string') {
          return String(left) + String(right);
        }
        throw new RuntimeError(expression.operator, 'Operands must be two numbers or two strings.');
      case TokenType.SLASH:
        this.checkNumberOperands(expression.operator, left, right);
        return Number(left) / Number(right);
      case TokenType.STAR:
        this.checkNumberOperands(expression.operator, left, right);
        return Number(left) * Number(right);
      case TokenType.BANG_EQUAL:
        return !this.isEqual(left, right);
      case TokenType.EQUAL_EQUAL:
        return this.isEqual(left, right);
    }

    // Unreachable.
    return null;
  }

  private checkNumberOperand(operator: Token, operand: LoxLiteral) {
    if (typeof operand === 'number') return;
    throw new RuntimeError(operator, 'Operand must be a number.');
  }

  private checkNumberOperands(operator: Token, left: LoxLiteral, right: LoxLiteral) {
    if (typeof left === 'number' && typeof right === 'number') return;

    throw new RuntimeError(operator, 'Operands must be numbers.');
  }

  visitUnaryExpression(expression: Unary) {
    const right = this.evaluate(expression.right);

    switch (expression.operator.type) {
      case TokenType.MINUS:
        this.checkNumberOperand(expression.operator, right);
        return -Number(right);
      case TokenType.BANG:
        return !this.isTruthy(right);
    }

    // Unreachable.
    return null;
  }

  visitGroupingExpression(expression: Grouping) {
    return this.evaluate(expression.expression);
  }

  visitLiteralExpression(expression: Literal) {
    return expression.value;
  }

  visitPrintStatement(statement: PrintStatement) {
    const expression = this.evaluate(statement.expression);
    console.log(this.stringify(expression));
    return null;
  }

  visitExpressionStatement(statement: ExpressionStatement) {
    this.evaluate(statement.expression);
    return null;
  }
}
export default Interpreter;
