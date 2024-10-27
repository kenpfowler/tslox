import Environment from './Environment.ts';
import {
  Assign,
  Binary,
  Call,
  Expr,
  ExprVisitor,
  Grouping,
  Literal,
  Logical,
  Unary,
  Variable,
} from './Expr.ts';
import Lox from './Lox.ts';
import RuntimeError from './RuntimeError.ts';
import {
  Block,
  ExpressionStatement,
  Func,
  If,
  Print,
  Return,
  Stmt,
  StmtVisitor,
  Var,
  While,
} from './Stmt.ts';
import ReturnValue from './Return.ts';
import Token, { LoxLiteral } from './Token.ts';
import TokenType from './TokenType.ts';
import LoxFunction from './LoxFunction.ts';
import LoxCallable from './LoxCallable.ts';
const isLoxCallable = (callee: unknown): callee is LoxFunction => {
  return callee instanceof LoxFunction;
};

/**
 * Attempts to interpret a list of statements and produce the outputs/side effects
 */
class Interpreter implements ExprVisitor<LoxLiteral>, StmtVisitor<void> {
  private readonly globals = new Environment();
  private environment = this.globals;

  constructor() {
    this.globals.define(
      'clock',
      {
        arity: () => {
          return 0;
        },
        call: (interpreter: Interpreter, args: LoxLiteral[]) => {
          return Date.now() / 1000;
        },

        toString: () => {
          return '<native fn>';
        },
      } satisfies LoxCallable,
    );
  }

  public interpret(statements: Array<Stmt>) {
    try {
      for (const statement of statements) {
        this.execute(statement);
      }
    } catch (error) {
      if (error instanceof RuntimeError) Lox.runtimeError(error);
    }
  }

  private stringify(object: LoxLiteral) {
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

  /**
   * the interpreter calls the appropriate visit method for the expression passed
   * @param expression
   * @returns
   */
  private evaluate(expression: Expr): LoxLiteral {
    return expression.accept(this);
  }

  private execute(statement: Stmt) {
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

  visitBinaryExpr(expression: Binary) {
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
        throw new RuntimeError(
          expression.operator,
          'Operands must be two numbers or two strings.',
        );
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

  private checkNumberOperands(
    operator: Token,
    left: LoxLiteral,
    right: LoxLiteral,
  ) {
    if (typeof left === 'number' && typeof right === 'number') return;

    throw new RuntimeError(operator, 'Operands must be numbers.');
  }

  visitUnaryExpr(expression: Unary) {
    const right = this.evaluate(expression.right);

    switch (expression.operator.type) {
      case TokenType.BANG:
        return !this.isTruthy(right);
      case TokenType.MINUS:
        this.checkNumberOperand(expression.operator, right);
        return -Number(right);
    }

    // Unreachable.
    return null;
  }

  visitGroupingExpr(expression: Grouping) {
    return this.evaluate(expression.expr);
  }

  visitLiteralExpr(expression: Literal) {
    return expression.value;
  }

  visitPrintStmt(statement: Print) {
    const expression = this.evaluate(statement.expression);
    console.log(this.stringify(expression));
    return null;
  }

  /**
   * evaluates the expression within the ExpressionStatement.
   * @param statement
   * @returns null
   */
  visitExpressionStatementStmt(statement: ExpressionStatement) {
    this.evaluate(statement.expr);
    return null;
  }

  /**
   * gets the value referenced by the variable from the runtime environment
   * @param expression
   * @returns a literal value
   */
  visitVariableExpr(expression: Variable) {
    return this.environment.get(expression.name);
  }

  visitVarStmt(statement: Var) {
    let value: LoxLiteral = null;
    if (statement.initializer != null) {
      value = this.evaluate(statement.initializer);
    }

    this.environment.define(statement.name.lexeme, value);
    return null;
  }

  visitAssignExpr(expr: Assign): LoxLiteral {
    const value = this.evaluate(expr.value);
    this.environment.assign(expr.name, value);
    return value;
  }

  public executeBlock(statements: Array<Stmt>, environment: Environment) {
    const previous = this.environment;
    try {
      this.environment = environment;
      for (const statement of statements) {
        this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  }

  visitIfStmt(stmt: If) {
    if (this.isTruthy(this.evaluate(stmt.condition))) {
      this.execute(stmt.thenBranch);
    } else {
      if (stmt.elseBranch) {
        this.execute(stmt.elseBranch);
      }
    }

    return null;
  }

  visitLogicalExpr(expr: Logical) {
    const left = this.evaluate(expr.left);

    if (expr.operator.type === TokenType.OR) {
      if (this.isTruthy(left)) return left;
    } else {
      if (!this.isTruthy(left)) return left;
    }

    return this.evaluate(expr.right);
  }

  visitBlockStmt(stmt: Block) {
    this.executeBlock(stmt.statements, new Environment(this.environment));

    return null;
  }

  visitWhileStmt(stmt: While) {
    while (this.evaluate(stmt.condition)) {
      this.execute(stmt.body);
    }
    return null;
  }

  visitCallExpr(expr: Call) {
    // Evaluate the callee to determine if it is
    const callee = this.evaluate(expr.callee);

    // interpret the arguments and store in an array
    const args: LoxLiteral[] = [];

    for (const arg of expr.args) {
      args.push(this.evaluate(arg));
    }

    if (!isLoxCallable(callee)) {
      throw new RuntimeError(
        expr.paren,
        'Can only call functions and classes.',
      );
    }

    const func = callee;

    if (args.length != func.arity()) {
      throw new RuntimeError(
        expr.paren,
        'Expected ' + func.arity() + ' arguments but got ' + args.length + '.',
      );
    }

    return func.call(this, args);
  }

  visitFuncStmt(stmt: Func) {
    const func = new LoxFunction(stmt, this.environment);
    this.environment.define(stmt.name.lexeme, func);
    return null;
  }

  visitReturnStmt(stmt: Return) {
    let value = null;

    if (stmt.value !== null) {
      value = this.evaluate(stmt.value);
    }

    throw new ReturnValue(value);
  }
}
export default Interpreter;
