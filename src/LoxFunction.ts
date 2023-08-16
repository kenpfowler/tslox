import Environment from './Environment';
import Interpreter from './Interpreter';
import LoxCallable from './LoxCallable';
import ReturnValue from './Return';
import { Func } from './Stmt';
import { LoxLiteral } from './Token';

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
