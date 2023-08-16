import Interpreter from './Interpreter';
import { LoxLiteral } from './Token';

export default interface LoxCallable {
  arity(): number;
  call(interpreter: Interpreter, args: Array<LoxLiteral>): LoxLiteral;
  toString(): string;
}
