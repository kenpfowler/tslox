import Environment from './Environment.ts';
import Interpreter from './Interpreter.ts';
import LoxCallable from './LoxCallable.ts';
import ReturnValue from './Return.ts';
import { Func } from './Stmt.ts';
import { LoxLiteral } from './Token.ts';

export default class LoxFunction implements LoxCallable {
  private readonly closure;
  private readonly declaration;

  constructor(declaration: Func, closure: Environment) {
    this.closure = closure;
    this.declaration = declaration;
  }

  public arity(): number {
    return this.declaration.params.length;
  }

  public call(interpreter: Interpreter, args: LoxLiteral[]): LoxLiteral {
    const environment = new Environment(this.closure);
    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.define(this.declaration.params[i].lexeme, args[i]);
    }

    try {
      interpreter.executeBlock(this.declaration.body, environment);
    } catch (returnValue) {
      if (returnValue instanceof ReturnValue) return returnValue.value;
    }

    return null;
  }

  public toString() {
    return '<fn ' + this.declaration.name.lexeme + '>';
  }
}
