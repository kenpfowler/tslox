import Interpreter from './Interpreter.ts';
import { LoxLiteral } from './Token.ts';

export default interface LoxCallable {
  arity(): number;
  call(interpreter: Interpreter, args: Array<LoxLiteral>): LoxLiteral;
  toString(): string;
}
